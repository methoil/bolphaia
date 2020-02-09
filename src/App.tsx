import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Login from './components/lobby/login';
import Games from './components/lobby/lobby';

interface IAppState {
  username: string,
}

class App extends React.Component {
  state: IAppState = {username: ''};
  
  render() {
    let contents;
    if (this.state.username) {
      contents = <Games username={this.state.username} />;
    } else {
      contents = <Login login={this.enterGame.bind(this)} />;
    }
    return <Container>{contents}</Container>;
  }
  enterGame(username) {
    this.setState({
      username: username
    });
  }
}
export default App;
