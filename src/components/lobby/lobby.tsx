import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { TokenProvider, ChatManager } from '@pusher/chatkit-client';
import axios from 'axios';
import Rooms from './rooms';
import Chat from './chat';
import { playerIds } from '../game/game.model';
import { BACKEND_URL } from '../../app-constants';

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

export default class Lobby extends React.Component<ILobbyProps, any> {
  state: ILobbyState = {
    joined: [],
    joinable: [],
  };
  chat;
  chatManager;

  constructor(props) {
    super(props);
    this.chatManager = new ChatManager({
      instanceLocator: 'v1:us1:f3854d62-ebf2-4ee2-8a48-c62ed279fa8f', // TODO: import this from global consts
      tokenProvider: new TokenProvider({
        url: `${BACKEND_URL}/auth`,
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
        setInterval(this.pollRooms.bind(this), 5000);
        this.pollRooms();
      })
      .catch(e => {
        console.log('Failed to connect to Chatkit');
        console.log(e);
      });
  }

  private pollRooms() {
    const { currentUser } = this.state;
    currentUser.getJoinableRooms().then(rooms => {
      this.setState({
        joined: currentUser.rooms,
        joinable: rooms,
      });
    });
  }

  private enterRoom(id) {
    const { currentUser } = this.state;
    currentUser
      .joinRoom({ roomId: id })
      .then(() => {
        this.setState({
          activeRoom: id,
        });
        this.pollRooms();
      })
      .catch(() => {
        console.log('Failed to enter room');
      });
  }

  private leaveRoom(id) {
    const { currentUser } = this.state;
    // TODO: temp disable toom deletion so I can see if games persist over time
    if (this.chat) {
      const playersInRoom = this.chat.getPlayersInRoom();
      if (playersInRoom.length === 1 && playersInRoom[0].id === currentUser.id) {
        currentUser.deleteRoom({ roomId: id });
      }
    }
    currentUser
      .leaveRoom({ roomId: id })
      .then(() => {
        this.pollRooms();
      })
      .catch(() => {
        console.log('Failed to leave room');
      });
  }

  // TODO: this is being set so poorly.. def some sort of antipattern
  private startedGame(roomId, white, black): Promise<any> {
    return axios
      .request({
        url: `${BACKEND_URL}/games`,
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
        this.pollRooms();
        return {
          [white]: playerIds.phrygians,
          [black]: playerIds.hittites,
        };
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
            startedGame={this.startedGame.bind(this)}
            game={game}
            ref={child => {
              this.chat = child;
            }}
          />
        );
      }
    }

    return (
      <Segment className={'segment-grid-container'}>
        <Grid>
          <Grid.Column width={2}>
            <Rooms
              joined={this.state.joined}
              joinable={this.state.joinable}
              activeRoom={this.state.activeRoom}
              enterRoom={this.enterRoom.bind(this)}
              leaveRoom={this.leaveRoom.bind(this)}
            />
          </Grid.Column>
          <Grid.Column width={12}>{chat}</Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
