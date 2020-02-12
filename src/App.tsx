import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Game from './components/game/game';
import Home from './components/game/home';
import OnlineModeEntry from './components/game/onlineModeEntry';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

interface IAppState {
  username: string;
}

class App extends React.Component {
  state: IAppState = { username: '' };

  render() {
    return (
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/offline-mode">
              <Game offlineMode={true} />
            </Route>
            <Route path="/online-mode">
              <OnlineModeEntry />
            </Route>
            <Route path="/" component={Home} exact />
          </Switch>
        </div>
    );
  }

  enterGame(username) {
    this.setState({
      username: username,
    });
  }
}

export default App;
