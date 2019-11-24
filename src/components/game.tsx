import * as React from "react";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";

import "../index.css";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces";

export type IBoardState = (IPiece | null)[][];
export type ISelectedPiece = { piece: IPiece | null; location: coordinate };

interface IGameState {
  boardState: IBoardState;
  selectedPiece: ISelectedPiece;
}

export default class Game extends React.Component<{dispatch}, {}> {
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
      boardState: this.initializeBoard(8, 8)
    };
  }

  private initializeBoard(xSize: number, ySize: number): IBoardState {
    const boardState = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 1) {
        pieceToPlace = new levy("slavs");
      } else if (x === 6) {
        pieceToPlace = new levy("thracians");
      }

      boardState.push(new Array(ySize).fill(pieceToPlace));
    }

    return boardState;
  }

  private onClick(xIndex: number, yIndex: number): void {
    const clickedPiece = this.state.boardState[xIndex][yIndex];

    if (!this.state.selectedPiece.piece && clickedPiece != null) {
      return this.setState({
        selectedPiece: {
          piece: clickedPiece,
          location: { x: xIndex, y: yIndex }
        }
      });
    }

    if (
      !!this.state.selectedPiece.piece &&
      this.state.selectedPiece.piece.isMovePossible(
        this.state.selectedPiece.location,
        {
          x: xIndex,
          y: yIndex
        }
      )
    ) {
      const newBoardState = cloneDeep(this.state.boardState);
      newBoardState[this.state.selectedPiece.location.x][
        this.state.selectedPiece.location.y
      ] = null;
      newBoardState[xIndex][yIndex] = this.state.selectedPiece.piece;
      return this.setState({
        boardState: newBoardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }

    // unselect piece when clicking on invalid move location
    if (
      !!this.state.selectedPiece.piece &&
      !this.state.selectedPiece.piece.isMovePossible(
        this.state.selectedPiece.location,
        {
          x: xIndex,
          y: yIndex
        }
      )
    ) {
      return this.setState({
        selectedPiece: { piece: null, location: { x: -1, y: -1 } }
      });
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    boardState: state.boardState,
    selectedPiece: state.selectedPiece,
  };
};

const gameContainer = connect(mapStateToProps)(Game);
