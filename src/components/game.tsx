import * as React from "react";
import { cloneDeep } from "lodash";

import "../index.css";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces";
import Cataphract from "./pieces/cataphract";

const BOARD_SIZE: number = 0;

export type IPossibleMoves = boolean[][];
export type IBoardState = (IPiece | null)[][];

interface IGameState {
  boardState: IBoardState;
  selectedPiece: { piece: IPiece | null; location: coordinate };
}

export default class Game extends React.Component<{}, {}> {
  state: IGameState;

  render() {
    return (
      <Board
        boardState={this.state.boardState}
        onClick={this.onClick.bind(this)}
      ></Board>
    );
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.state = {
      selectedPiece: { piece: null, location: { x: -1, y: -1 } },
      boardState: this.initializeBoard(BOARD_SIZE, BOARD_SIZE),
    };
  }

  private initializeBoard(xSize: number, ySize: number): IBoardState {
    const boardState = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 0) {
        const rowArray = new Array(ySize).fill(null);
        rowArray[1] = new Cataphract("slavs");
        rowArray[6] = new Cataphract("slavs");
        boardState.push(rowArray);
        continue;
      } else if (x === 1) {
        pieceToPlace = new levy("slavs");
      } else if (x === 6) {
        pieceToPlace = new levy("thracians");
      } else if (x === 7) {
        const rowArray = new Array(ySize).fill(null);
        rowArray[1] = new Cataphract("thracians");
        rowArray[6] = new Cataphract("thracians");
        boardState.push(rowArray);
        continue;
      }

      boardState.push(new Array(ySize).fill(pieceToPlace));
    }

    return boardState;
  }

  private onClick(clickedSquare: coordinate): void {
    const clickedPiece = this.state.boardState[clickedSquare.x][clickedSquare.y];
    const selectedPiece = this.state.selectedPiece.piece;

    // Select the clicked piece if none is currently selected
    if (!selectedPiece && clickedPiece != null) {
      return this.setState({
        selectedPiece: {
          piece: clickedPiece,
          location: { clickedSquare }
        }
      });
    }

    // Move the piece if a valid move is selected
    if (
      !!selectedPiece &&
      selectedPiece.isMovePossible(
        this.state.selectedPiece.location,
        clickedSquare,
      )
    ) {
      const newBoardState = cloneDeep(this.state.boardState);
      newBoardState[this.state.selectedPiece.location.x][
        this.state.selectedPiece.location.y
      ] = null;
      newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
      return this.setState({
        boardState: newBoardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }

    // unselect piece when clicking on invalid move location
    if (
      !!selectedPiece &&
      !selectedPiece.isMovePossible(
        this.state.selectedPiece.location,
        clickedSquare,
      )
    ) {
      return this.setState({
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }
  }
}
