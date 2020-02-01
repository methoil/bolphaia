import React from 'react';
import { Grid, List, Comment, Form, Input } from 'semantic-ui-react';

interface IMessage {
  id: string;
  user: string;
  message: string;
}

interface IUser {
  id: string;
  name: string;
  sendMessage: (payload: { text: string; roomId: string }) => void;
}

interface IChatProps {
  user: IUser;
  room: { id: string; users: IUser[] }; // ????????
}

interface IChatState {
  users: IUser[];
  messages: IMessage[];
  newMessage: string;
}

interface IChatComponent {
  messagesEnd: any; // wtf is this?????
}

export default class Chat extends React.Component<IChatProps, any> implements IChatComponent {
  state: IChatState;
  messagesEnd;

  constructor(props) {
    super(props);
    this.state = {
      users: [], // props.room.users,
      messages: [],
      newMessage: '',
    };
    props.user.subscribeToRoomMultipart({
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
          messages.push({
            id: message.id,
            user: message.senderId,
            message: message?.parts?.[0]?.payload?.content ?? '',
          });
          this.setState({
            messages: messages,
          });
        },
      },
    });
  }
  render() {
    const users = this.state.users
      .filter(user => user.id !== this.props.user.id)
      .map(user => (
        <List.Item key={user.id}>
          <List.Content>{user.name}</List.Content>
        </List.Item>
      ));
    const messages = this.state.messages.map(message => {
      return (
        <Comment key={message.id}>
          <Comment.Content>
            <Comment.Author>{message.user}</Comment.Author>
            <Comment.Text>{message.message}</Comment.Text>
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
}
