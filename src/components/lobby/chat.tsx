import React from 'react';
import { Grid, List, Comment, Form, Input } from 'semantic-ui-react';
import { IRoom } from './rooms';
import { IUser } from './lobby';
import GameBoard from '../game/game';
import { playerIds } from '../game/game.model';

let playerSide = playerIds.phrygians;
let opponentId = '';

interface IMessage {
  id: string;
  user: string;
  message: string;
  opponent?: string;
}

interface IChatProps {
  user: IUser;
  room: IRoom;
  gameGameRoomId: string;
  startedGame: (roomId: string, white: string, black: string) => Promise<any>;
}

interface IChatState {
  users: IUser[];
  messages: IMessage[];
  newMessage: string;
}

interface IChatComponent {
  // messagesEnd: any;
  gameBoard: HTMLElement | undefined;
  // playerSide: any; // TODO: get this working instead of global var
}

export default class Chat extends React.Component<IChatProps, any> implements IChatComponent {
  state: IChatState;
  private messagesEnd;
  public gameBoard;

  constructor(props) {
    super(props);
    this.state = {
      users: [], // props.room.users,
      messages: [],
      newMessage: '',
    };

    props.user
      .subscribeToRoomMultipart({
        roomId: props.room.id,
        messageLimit: 100,
        hooks: {
          onUserJoined: user => {
            this.setState({
              users: props.room.users,
            });
          },
          onUserLeft: user => {
            this.setState({
              users: props.room.users,
            });
          },
          onMessage: message => {
            const messages = this.state.messages;
            let opponent;
            if (message?.parts?.[1]?.payload?.url?.startsWith('urn:player:')) {
              opponent = message?.parts?.[1]?.payload?.url?.substring(11);
              if (opponent !== props.user.id) {
                opponent = undefined;
              }
            }
            messages.push({
              id: message.id,
              user: message.senderId,
              opponent,
              message: message?.parts?.[0]?.payload?.content ?? '',
            });
            this.setState({
              messages: messages,
            });
          },
        },
      })
      .then(() => {
        this.setState({
          users: props.room.users,
        });
      });
  }

  render() {
    const users = this.state.users
      .filter(user => user.id !== this.props.user.id)
      .map(user => (
        <List.Item key={user.id}>
          <List.Content floated="right">
            <a onClick={() => this.challengePlayer(user)}>Challenge</a>
          </List.Content>
          <List.Content>{user.name}</List.Content>
        </List.Item>
      ));

    const messages = this.state.messages
      .map(message => {
        let acceptGame;
        if (message.opponent) {
          acceptGame = (
            <Comment.Actions>
              <Comment.Action onClick={() => this.acceptChallenge(message.user)}>
                Accept Challenge
              </Comment.Action>
            </Comment.Actions>
          );
        }
        return (
          <Comment key={message.id}>
            <Comment.Content>
              <Comment.Author>{message.user}</Comment.Author>
              <Comment.Text>{message.message}</Comment.Text>
              {acceptGame}
            </Comment.Content>
          </Comment>
        );
      })
      .reverse();

    const roomId = this.props.gameGameRoomId;
    let gameBoard =
      roomId && playerSide ? (
        <GameBoard
          roomId={roomId}
          offlineMode={false}
          userId={this.props.user.id}
          ref={child => {
            this.gameBoard = child;
          }}
          startGameCallback={() => this.startGameCallback(roomId, opponentId)}
        />
      ) : null;

    if (gameBoard) {
      return gameBoard;
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <Comment.Group style={{ height: '20em', overflow: 'auto' }}>{messages}</Comment.Group>
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <List style={{ maxHeight: '20em', overflow: 'auto' }}>
              <List.Item>
                <b>{this.props.user.name}</b>
              </List.Item>
              {users}
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <Input
                action="Post"
                placeholder="New Message..."
                value={this.state.newMessage}
                fluid
                autoFocus
                onChange={this.handleNewMessageChange.bind(this)}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  componentDidMount() {
    // this.scrollToBottom();
  }

  componentDidUpdate() {
    // this.scrollToBottom();
  }

  private scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

  private handleNewMessageChange(e) {
    this.setState({
      newMessage: e.target.value,
    });
  }

  private handleSubmit() {
    const { newMessage } = this.state;
    const { user, room } = this.props;
    user.sendMessage({
      text: newMessage,
      roomId: room.id,
    });
    this.setState({
      newMessage: '',
    });
  }

  private challengePlayer(player: IUser) {
    const { user, room } = this.props;
    user.sendMessage({
      text: `I challenge ${player.name} to a game`,
      roomId: room.id,
      attachment: {
        link: `urn:player:${player.id}`,
        type: 'file',
        fetchRequired: false,
      },
    });
  }

  private async acceptChallenge(opponent: string) {
    const { user } = this.props;
    const room = await user.createRoom({
      name: `${user.id} vs ${opponent}`,
      addUserIds: [opponent],
    });
    return this.startGameCallback(room.id, opponent);
  }

  public async startGameCallback(roomId: string, opponent?: string): Promise<void> {
    if (!opponent) {
      const playersInRoom = this.props.room.name.split('vs');
      opponent =
        playersInRoom[0].trim() === this.props.user.name
          ? playersInRoom[1].trim()
          : playersInRoom[0].trim();
    }
    const res = await this.props.startedGame(roomId, this.props.user.id, opponent);
    playerSide = res[this.props.user.id];
    // opponentSide = res[opponent];
  }

  getPlayersInRoom() {
    const players = this.gameBoard ? this.gameBoard.getPlayers() : [];
    const playersInRoom = this.state.users.filter(user => players.includes(user.id));
    return playersInRoom;
  }
}
