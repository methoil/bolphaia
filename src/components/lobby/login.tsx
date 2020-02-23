import React, {useState} from 'react';
import { Button, Form } from 'semantic-ui-react';

interface ILoginProps {
  login: (string) => void;
}

export default function(props: ILoginProps) {
  const [username, setUsername] = useState('');

    return (
      <div className="login-segment">
        <Form onSubmit={handleFormSubmit}>
          <Form.Field>
            <label>Username</label>
            <input
              placeholder="Username"
              value={username}
              autoFocus
              onChange={handleUsernameChange}
            />
          </Form.Field>
          <Button type="submit">Log in</Button>
        </Form>
      </div>
    );

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  // TODO: this can definitely be a hook
  function handleFormSubmit() {
    if (username) {
      props.login(username);
    }
  }
}
