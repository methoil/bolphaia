import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import gameReducers from "./redux/reducers";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {GameContainer} from "./components/game";

const store = createStore(gameReducers);

ReactDOM.render(
  <Provider store={store}>
    <GameContainer />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
