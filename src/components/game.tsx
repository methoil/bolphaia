import * as React from "react";
import { cloneDeep } from "lodash";

import "../index.scss";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces";
import Cataphract from "./pieces/cataphract";
import { getMovesPath } from "./pieces/piece.utils";
import { exportDefaultDeclaration } from "@babel/types";

const BOARD_WIDTH: number = 24;
const BOARD_HEIGHT: number = 16;

export type IPossibleMoves = boolean[][];
export type IBoardState = (IPiece | null)[][];

interface IGameState {
  boardState: IBoardState;
  highlightState: boolean[][];
  selectedPiece: { piece: IPiece | null; location: coordinate };
}

export default class Game extends React.Component<{}, {}> {
  state: IGameState;

  render() {
    return (
      <Board
        boardState={this.state.boardState}
        highlightState={this.state.highlightState}
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
      highlightState: this.generateEmptyHighlightedMoves()
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

  private generateEmptyHighlightedMoves(): boolean[][] {
    const highlightedMoves = [];
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      highlightedMoves.push(new Array(BOARD_WIDTH).fill(false));
    }
    return highlightedMoves;
  }

  private onClick(clickedSquare: coordinate): void {
    const clickedPiece = this.state.boardState[clickedSquare.x][
      clickedSquare.y
    ];
    const selectedPiece = this.state.selectedPiece.piece;

    // nothing to do
    if (!selectedPiece && !clickedPiece) {
      return;
    }

    // Select the clicked piece if none is currently selected
    if (!selectedPiece && clickedPiece != null) {
      return this.setState({
        selectedPiece: {
          piece: clickedPiece,
          location: { ...clickedSquare }
        },
        highlightState: this.generatePossibleMovesHighlights(
          clickedSquare,
          clickedPiece.moveRange
        )
      });
    }

    const isMovePossible = this.state.highlightState[clickedSquare.x][
      clickedSquare.y
    ];

    // Move the piece if a valid move is selected
    if (!!selectedPiece && isMovePossible) {
      const newBoardState = cloneDeep(this.state.boardState);
      newBoardState[this.state.selectedPiece.location.x][
        this.state.selectedPiece.location.y
      ] = null;
      newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
      return this.setState({
        boardState: newBoardState,
        selectedPiece: { piece: null, location: { x: -1, y: -1 } },
        highlightState: this.generateEmptyHighlightedMoves()
      });
    }

    // unselect piece when clicking on invalid move location
    if (!!selectedPiece && !isMovePossible) {
      return this.setState({
        selectedPiece: { piece: null, location: { x: -1, y: -1 } },
        highlightState: this.generateEmptyHighlightedMoves()
      });
    }
  }

  private generatePossibleMovesHighlights(
    src: coordinate,
    range: number
  ): boolean[][] {
    const highlightedMoves = [];
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      highlightedMoves.push(new Array(BOARD_WIDTH).fill(false));
    }
    const dimensions: number[] = [-range, 0, range];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const dest = {
          x: this.getValidIndex(src.x + dimensions[x], BOARD_HEIGHT - 1),
          y: this.getValidIndex(src.y + dimensions[y], BOARD_WIDTH - 1)
        };
        const movesPath = getMovesPath(src, dest, this.state.boardState);

        for (let i of movesPath) {
          highlightedMoves[i.x][i.y] = true;
        }
      }
    }

    return highlightedMoves;
  }

  private getValidIndex(index: number, maxIndex: number): number {
    if (index > maxIndex) {
      return maxIndex;
    } else if (index < 0) {
      return 0;
    } else {
      return index;
    }
  }
}
