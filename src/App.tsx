import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';
import Game from './components/game/game';
import Home from './components/game/home';
import OnlineModeEntry from './components/lobby/onlineModeEntry';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/offline-mode">
          <Grid>
            <Grid.Column width={12}>{<Game offlineMode={true} />}</Grid.Column>
          </Grid>
        </Route>
        <Route path="/online-mode">
          <OnlineModeEntry />
        </Route>
        <Route path="/" component={Home} exact />
      </Switch>
    </div>
  );
}

export default App;
