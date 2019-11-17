import * as React from "react";

import "../index.css";
import Board from "./board";
import levy from './pieces/levy';
import {IPiece} from './pieces/IPieces';

export type IBoardState  = (IPiece | null) [][]; 

interface IGame {
  boardState: IBoardState;
}

export default class Game extends React.Component<IGame, {}> {
  boardState: IBoardState = [];

  render() {
    return <Board boardState={this.boardState} onClick={this.onClick}></Board>;
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.initializeBoard(8, 8);
  }

  private initializeBoard(xSize: number, ySize: number): void {
    this.boardState = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 1) {
          pieceToPlace = new levy('slavs');
      } else if (x === 6) {
          pieceToPlace = new levy('thracians');
      }

      this.boardState.push(new Array(ySize).fill(pieceToPlace));
    }
  }

  private onClick(xIndex: number, yIndex: number): void {
    if (!this.boardState[xIndex][yIndex]) {
        return;
    }

    // if (this.boardState[xIndex][yIndex] === 'L' ) {

    //     return;
    // }
  }
}
