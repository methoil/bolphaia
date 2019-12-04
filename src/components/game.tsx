import * as React from "react";
import { cloneDeep } from "lodash";

import "../index.css";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces";
import Cataphract from "./pieces/cataphract";
import { getMovesPath } from "./pieces/piece.utils";

const BOARD_WIDTH: number = 24;
const BOARD_HEIGHT: number = 16;

export type IPossibleMoves = boolean[][];
export type IBoardState = (IPiece | null)[][];

interface IGameState {
  boardState: IBoardState;
  highlightedSquares: boolean[][];
  selectedPiece: { piece: IPiece | null; location: coordinate };
}

export default class Game extends React.Component<{}, {}> {
  state: IGameState;

  render() {
    return (
      <Board
        boardState={this.state.boardState}
        highlightedSquares={this.state.highlightedSquares}
        onClick={this.onClick.bind(this)}
      ></Board>
    );
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.state = {
      selectedPiece: { piece: null, location: { x: -1, y: -1 } },
      boardState: this.initializeBoard(BOARD_HEIGHT, BOARD_WIDTH),
      highlightedSquares: []
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
    const clickedPiece = this.state.boardState[clickedSquare.x][
      clickedSquare.y
    ];
    const selectedPiece = this.state.selectedPiece.piece;

    // Select the clicked piece if none is currently selected
    if (!selectedPiece && clickedPiece != null) {
      return this.setState({
        selectedPiece: {
          piece: clickedPiece,
          location: { ...clickedSquare }
        },
        highlightedSquares: this.generatePossibleMovesHighlights(
          clickedSquare,
          clickedPiece.moveRange
        )
      });
    }

    // Move the piece if a valid move is selected
    if (
      !!selectedPiece &&
      selectedPiece.isMovePossible(
        this.state.selectedPiece.location,
        clickedSquare
      )
    ) {
      const newBoardState = cloneDeep(this.state.boardState);
      newBoardState[this.state.selectedPiece.location.x][
        this.state.selectedPiece.location.y
      ] = null;
      newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
      return this.setState({
        boardState: newBoardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } },
        highlightedSquares: []
      });
    }

    // unselect piece when clicking on invalid move location
    if (
      !!selectedPiece &&
      !selectedPiece.isMovePossible(
        this.state.selectedPiece.location,
        clickedSquare
      )
    ) {
      return this.setState({
        selectedPiece: { piece: null, location: { x: -1, y: -1 } },
        highlightedSquares: []
      });
    }
  }

  private generatePossibleMovesHighlights(
    src: coordinate,
    range: number
  ): boolean[][] {
    const highlightedMoves = [];
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      highlightedMoves.push(new Array(BOARD_HEIGHT).fill(false));
    }
    const dimensions: number[] = [-range, 0, range];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const dest = { x: src.x + dimensions[x], y: src.y + dimensions[y] };
        const movesPath = getMovesPath(src, dest, this.state.boardState);

        for (let i of movesPath) {
          highlightedMoves[i.x][i.y] = true;
        }
      }
    }

    return highlightedMoves;
  }
}
