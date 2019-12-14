import * as React from "react";
import { cloneDeep, findIndex } from "lodash";

import "../index.scss";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate } from "./pieces/IPieces.model";
import Cataphract from "./pieces/cataphract";
import { getMovesPath } from "./pieces/piece.utils";
import Archer from "./pieces/archer";

export const BOARD_WIDTH: number = 24;
export const BOARD_HEIGHT: number = 16;

export type IPossibleMoves = boolean[][];
export type IBoardState = (IPiece | null)[][];

interface IGameState {
  boardState: IBoardState;
  highlightState: boolean[][];
  selectedSquare: coordinate | null;
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
      selectedSquare: null,
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
        rowArray[3] = new Archer('slavs');
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
        rowArray[3] = new Archer('thracians');
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
    const selectedSquare = this.state.selectedSquare;
    const clickedPiece = this.state.boardState[clickedSquare.x][clickedSquare.y];
    const selectedPiece =
      selectedSquare && this.state.boardState[selectedSquare.x][selectedSquare.y];

    // nothing to do
    if (!selectedPiece && !clickedPiece) {
      return;
    }

    // Select the clicked piece if none is currently selected
    if (!selectedPiece && clickedPiece != null) {
      return this.setState({
        selectedSquare: { ...clickedSquare },
        highlightState: this.generatePossibleMovesHighlights(clickedSquare, clickedPiece.moveRange)
      });
    }

    const isMovePossible = this.state.highlightState[clickedSquare.x][clickedSquare.y];

    // Move the piece if a valid move is selected
    if (selectedPiece && selectedSquare && isMovePossible) {
      const newBoardState = cloneDeep(this.state.boardState);
      // combat occurs on destination arrival
      // trample will happen elsewhere?
      if (clickedPiece && clickedPiece !== selectedPiece) {
        clickedPiece.takeDamage(selectedPiece.attack);
        if (clickedPiece.health <= 0) {
          // TODO: move clicked piece to graveyard
          newBoardState[selectedSquare.x][selectedSquare.y] = null;
          newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
        } else {
          const movesPath = getMovesPath(selectedSquare, clickedSquare, this.state.boardState);
          const indexBeforeDest =
            findIndex(movesPath, move => {
              return move.x === clickedSquare.x && move.y === clickedSquare.y;
            }) - 1;

          if (indexBeforeDest < 0) {
            // TODO: handle this... possibility..
            console.error("something went wrong.. should not happen.. crash imminent");
          }

          const dest = movesPath[indexBeforeDest];
          newBoardState[selectedSquare.x][selectedSquare.y] = null;
          newBoardState[dest.x][dest.y] = selectedPiece;
          newBoardState[clickedSquare.x][clickedSquare.y] = clickedPiece;
        }
      } else {
        newBoardState[selectedSquare.x][selectedSquare.y] = null;
        newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
      }

      return this.setState({
        boardState: newBoardState,
        selectedSquare: null,
        highlightState: this.generateEmptyHighlightedMoves()
      });
    }

    // unselect piece when clicking on invalid move location
    if (selectedPiece && !isMovePossible) {
      return this.setState({
        selectedSquare: null,
        highlightState: this.generateEmptyHighlightedMoves()
      });
    }
  }

  private generatePossibleMovesHighlights(src: coordinate, range: number): boolean[][] {
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
