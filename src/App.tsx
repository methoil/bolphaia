import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid } from 'semantic-ui-react';
import Game from './components/game/game';
import Home from './components/game/home';
import OnlineModeEntry from './components/lobby/onlineModeEntry';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

interface IAppState {
  username: string;
}

class App extends React.Component {
  state: IAppState = { username: '' };

  render() {
    return (
      <div>
        <Switch>
          <Route path="/offline-mode">{oneScreenGameWrapper()}</Route>
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

function oneScreenGameWrapper() {
  return (
    <Grid>
      <Grid.Column width={12}>{<Game offlineMode={true} />}</Grid.Column>
    </Grid>
  );
}

export default App;
