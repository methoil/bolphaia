import React from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';

interface ILobbyState {
  username: string;
}

interface ILoginProps {
  login: (string) => void;
}

export default class Login extends React.Component<ILoginProps, any> {
  state: ILobbyState = {
    username: '',
  };

  render() {
    return (
      <Segment>
        <Form onSubmit={this.handleFormSubmit.bind(this)}>
          <Form.Field>
            <label>Username</label>
            <input
              placeholder="Username"
              value={this.state.username}
              autoFocus
              onChange={this.handleUsernameChange.bind(this)}
            />
          </Form.Field>
          <Button type="submit">Log in</Button>
        </Form>
      </Segment>
    );
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  handleFormSubmit() {
    if (this.state.username) {
      this.props.login(this.state.username);
    }
  }
}
