import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { TokenProvider, ChatManager } from '@pusher/chatkit-client';
import axios from 'axios';
import Rooms from './rooms';
import Chat from './chat';

interface ILobby {
  // chatManager: any;
  _chat: HTMLElement;
}

interface ILobbyState {
  joined: [];
  joinable: [];
  chatManager?: any;
  lobbyId?: string;
  activeRoom?: string;
  currentUser?: any;
}

interface ILobbyProps {
  username: string;
}

export default class Lobby extends React.Component<ILobbyProps, any> implements ILobby {
  state: ILobbyState = {
    joined: [],
    joinable: [],
  };
  public _chat;
  chatManager;

  constructor(props) {
    super(props);
    this.chatManager = new ChatManager({
      instanceLocator: 'v1:us1:f3854d62-ebf2-4ee2-8a48-c62ed279fa8f', // todo: import this from global consts
      tokenProvider: new TokenProvider({
        url: 'http://localhost:4000/auth',
      }),
      userId: props.username,
    });

    this.chatManager
      .connect()
      .then(currentUser => {
        this.setState({
          currentUser: currentUser,
        });
        currentUser.getJoinableRooms().then(rooms => {
          let lobby = rooms.find(room => room.name === 'Lobby');
          if (lobby) {
            currentUser.joinRoom({ roomId: lobby.id });
          } else {
            lobby = currentUser.rooms.find(room => room.name === 'Lobby');
          }
          if (lobby) {
            this.setState({
              lobbyId: lobby.id,
              activeRoom: lobby.id,
            });
          }
        });
        setInterval(this._pollRooms.bind(this), 5000);
        this._pollRooms();
      })
      .catch(e => {
        console.log('Failed to connect to Chatkit');
        console.log(e);
      });
  }
  private _pollRooms() {
    const { currentUser } = this.state;
    currentUser.getJoinableRooms().then(rooms => {
      this.setState({
        joined: currentUser.rooms,
        joinable: rooms,
      });
    });
  }
  _enterRoom(id) {
    const { currentUser } = this.state;
    currentUser
      .joinRoom({ roomId: id })
      .then(() => {
        this.setState({
          activeRoom: id,
        });
        this._pollRooms();
      })
      .catch(() => {
        console.log('Failed to enter room');
      });
  }
  _leaveRoom(id) {
    const { currentUser } = this.state;
    // temp disable toom deletion so I can see if games persist over time
    if (this._chat && false) {
      const playersInRoom = this._chat.getPlayersInRoom();
      if (playersInRoom.length === 1 && playersInRoom[0].id === currentUser.id) {
        currentUser.deleteRoom({ roomId: id });
      }
    }
    currentUser
      .leaveRoom({ roomId: id })
      .then(() => {
        this._pollRooms();
      })
      .catch(() => {
        console.log('Failed to leave room');
      });
  }

  _startedGame(roomId, white, black) {
    axios
      .request({
        url: 'http://localhost:4000/games',
        method: 'POST',
        data: {
          room: roomId,
          whitePlayer: white,
          blackPlayer: black,
        },
      })
      .then(response => {
        this.setState({
          activeRoom: roomId,
        });
        this._pollRooms();
      });
  }

  render() {
    const { currentUser } = this.state;
    let chat;
    if (currentUser) {
      const room = currentUser.rooms.find(room => room.id == this.state.activeRoom);
      if (room) {
        const game = this.state.activeRoom !== this.state.lobbyId && this.state.activeRoom;
        chat = (
          <Chat
            user={currentUser}
            room={room}
            key={room.id}
            startedGame={this._startedGame.bind(this)}
            game={game}
            ref={child => {
              this._chat = child;
            }}
          />
        );
      }
    }
    return (
      <Segment>
        <Grid>
          <Grid.Column width={4}>
            <Rooms
              joined={this.state.joined}
              joinable={this.state.joinable}
              activeRoom={this.state.activeRoom}
              enterRoom={this._enterRoom.bind(this)}
              leaveRoom={this._leaveRoom.bind(this)}
            />
          </Grid.Column>
          <Grid.Column width={12}>{chat}</Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
