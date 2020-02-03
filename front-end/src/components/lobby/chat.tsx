import React from 'react';
import { Grid, List, Comment, Form, Input } from 'semantic-ui-react';
import { IRoom } from './rooms';
// import GameBoard from './gameBoard';
import GameBoard from '../game';
import { playerIds } from '../game.model';

let playerSide = playerIds.phrygians;

interface IMessage {
  id: string;
  user: string;
  message: string;
  opponent?: string;
}

interface IUser {
  id: string;
  name: string;
  sendMessage: (payload: { text: string; roomId: string; attachment?: any }) => void;
  createRoom: (paylod: { name: string; addUserIds: string[] }) => Promise<IRoom>;
}

interface IChatProps {
  user: IUser;
  room: { id: string; users: IUser[] }; // ????????
  game: any;
  startedGame: (roomId: string, white: string, black: string) => Promise<any>;
}

interface IChatState {
  users: IUser[];
  messages: IMessage[];
  newMessage: string;
}

interface IChatComponent {
  // messagesEnd: any; // wtf is this?????
  _gameBoard: HTMLElement | undefined;
  // playerSide: any; // TODO: get this right..
}

export default class Chat extends React.Component<IChatProps, any> implements IChatComponent {
  state: IChatState;
  private messagesEnd;
  public _gameBoard;


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
            <a onClick={() => this._challengePlayer(user)}>Challenge</a>
          </List.Content>
          <List.Content>{user.name}</List.Content>
        </List.Item>
      ));
    const messages = this.state.messages.map(message => {
      let acceptGame;
      if (message.opponent) {
        acceptGame = (
          <Comment.Actions>
            <Comment.Action onClick={() => this._acceptChallenge(message.user)}>
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
    });
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
            <Form onSubmit={this._handleSubmit.bind(this)}>
              <Input
                action="Post"
                placeholder="New Message..."
                value={this.state.newMessage}
                fluid
                autoFocus
                onChange={this._handleNewMessageChange.bind(this)}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.props.game && playerSide && (
              <GameBoard
                roomId={this.props.game}
                offlineMode={false}
                userId={this.props.user.id}
                ref={child => {
                  this._gameBoard = child;
                }}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  componentDidMount() {
    this._scrollToBottom();
  }
  componentDidUpdate() {
    this._scrollToBottom();
  }
  _scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }
  _handleNewMessageChange(e) {
    this.setState({
      newMessage: e.target.value,
    });
  }
  _handleSubmit() {
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
  _challengePlayer(player) {
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
  _acceptChallenge(player) {
    const { user } = this.props;
    user
      .createRoom({
        name: `${user.id} vs ${player}`,
        addUserIds: [player],
      })
      .then(room => {
        this.props.startedGame(room.id, user.id, player).then(res => {
            playerSide = res[this.props.user.id];
        });
      });
  }

  getPlayersInRoom() {
    const players = this._gameBoard ? this._gameBoard.getPlayers() : [];
    const playersInRoom = this.state.users.filter(user => players.includes(user.id));
    return playersInRoom;
  }
}
