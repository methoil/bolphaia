import * as React from "react";

import "../index.css";
import Board from "./board";

interface IGame {
  boardState: string[][];
}

export default class Game extends React.Component<IGame, {}> {
  boardState: string[][] = [];

  render() {
    return <Board boardState={this.boardState}></Board>;
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.initializeBoard(8, 8);
  }

  private initializeBoard(xSize: number, ySize: number): void {
    this.boardState = [];
    for (let x = 0; x < xSize; x++) {
      const stingTofill = x === 1 ? "L" : "";
      this.boardState.push(new Array(ySize).fill(stingTofill) as string[]);
    }
  }
}
