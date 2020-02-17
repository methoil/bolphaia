import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './login';
import Games from './lobby';

interface IAppState {
  username: string,
}

class OnlineModeEntry extends React.Component {
  state: IAppState = {username: ''};
  
  render() {
    let contents;
    if (this.state.username) {
      contents = <Games username={this.state.username} />;
    } else {
      contents = <Login login={this.enterGame.bind(this)} />;
    }
    return contents;
  }
  enterGame(username) {
    this.setState({
      username: username
    });
  }
}
export default OnlineModeEntry;