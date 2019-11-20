import * as React from "react";
import { cloneDeep } from "lodash";

import "../index.css";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces";

export type IBoardState = (IPiece | null)[][];

interface IGame {
  boardState: IBoardState;
  selectedPiece: { piece: IPiece | null; location: coordinate };
}

export default class Game extends React.Component<IGame, {}> {
  boardState: IBoardState = [];
  selectedPiece: { piece: IPiece | null; location: coordinate };

  render() {
    return (
      <Board
        boardState={this.boardState}
        onClick={this.onClick.bind(this)}
      ></Board>
    );
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.selectedPiece = { piece: null, location: { x: -1, y: -1 } };
    this.initializeBoard(8, 8);
  }

  private initializeBoard(xSize: number, ySize: number): void {
    this.boardState = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 1) {
        pieceToPlace = new levy("slavs");
      } else if (x === 6) {
        pieceToPlace = new levy("thracians");
      }

      this.boardState.push(new Array(ySize).fill(pieceToPlace));
    }
  }

  private onClick(xIndex: number, yIndex: number): void {
    const clickedPiece = this.boardState[xIndex][yIndex];

    if (!this.selectedPiece.piece && clickedPiece != null) {
      return this.setState({
        // boardState: this.boardState,
        selectedPiece: {
          piece: clickedPiece,
          location: { x: xIndex, y: yIndex }
        }
      });
    }

    if (
      !!this.selectedPiece.piece &&
      this.selectedPiece.piece.isMovePossible(this.selectedPiece.location, {
        x: xIndex,
        y: yIndex
      })
    ) {
      const newBoardState = cloneDeep(this.boardState);
      newBoardState[this.selectedPiece.location.x][
        this.selectedPiece.location.y
      ] = null;
      newBoardState[xIndex][yIndex] = this.selectedPiece.piece;
      return this.setState({
        boardState: newBoardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }

    // unselect piece when clicking on invalid move location
    if (
      !!this.selectedPiece.piece &&
      !this.selectedPiece.piece.isMovePossible(this.selectedPiece.location, {
        x: xIndex,
        y: yIndex
      })
    ) {
      return this.setState({
        // boardState: this.boardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }
  }
}
