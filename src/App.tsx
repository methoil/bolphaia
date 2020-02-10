import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Game from './components/game';
import OnlineModeEntry from './components/onlineModeEntry';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

interface IAppState {
  username: string;
}

class App extends React.Component {
  state: IAppState = { username: '' };

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              {/* <li>
                <Link to="/">Home</Link>
              </li> */}
              <li>
                <Link to="/offline-mode">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/offline-mode">
              <Game offlineMode={true} />
            </Route>
            <Route path="/online-mode">
              <OnlineModeEntry />
            </Route>
            {/* <Route path="/">
              <App />;
            </Route> */}
          </Switch>
        </div>
      </Router>
    );
  }

  enterGame(username) {
    this.setState({
      username: username,
    });
  }
}

export default App;
