import * as React from "react";
import { cloneDeep, findIndex, get } from "lodash";

import "../index.scss";
import Board from "./board";
import levy from "./pieces/levy";
import { IPiece, coordinate, IRangedPiece } from "./pieces/IPieces.model";
import Cataphract from "./pieces/cataphract";
import { getMovesPath } from "./pieces/piece.utils";
import Archer from "./pieces/archer";

export const BOARD_WIDTH: number = 24;
export const BOARD_HEIGHT: number = 16;

export type IPossibleMove = {
  canMove: boolean;
  canAttack: boolean;
  inAttackRange: boolean;
};
export type IPossibleMoves = IPossibleMove[][];
export type ISelectedPiece = IPiece | IRangedPiece | null;
export type IBoardState = (IPiece | null)[][];

interface IGameState {
  boardState: IBoardState;
  highlightState: IPossibleMoves;
  selectedSquare: coordinate | null;
  mouseHoverIcon: string;
}

export default class Game extends React.Component<{}, {}> {
  state: IGameState;

  render() {
    return (
      <Board
        boardState={this.state.boardState}
        highlightState={this.state.highlightState}
        onMoveClick={this.onMoveClick.bind(this)}
        getHoverIcon={this.getHoverIcon.bind(this)}
      ></Board>
    );
  }

  constructor(props: any) {
    // no props will be passed here?
    super(props);
    this.state = {
      selectedSquare: null,
      boardState: this.initializeBoard(BOARD_HEIGHT, BOARD_WIDTH),
      highlightState: this.generateEmptyHighlightedMoves(),
      mouseHoverIcon: ""
    };
  }

  private initializeBoard(xSize: number, ySize: number): IBoardState {
    const boardState = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 0) {
        const rowArray = new Array(ySize).fill(null);
        rowArray[1] = new Cataphract("slavs");
        rowArray[3] = new Archer("slavs");
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
        rowArray[3] = new Archer("thracians");
        rowArray[6] = new Cataphract("thracians");
        boardState.push(rowArray);
        continue;
      }

      boardState.push(new Array(ySize).fill(pieceToPlace));
    }

    return boardState;
  }

  private getSelectedPiece() {
    return (
      this.state.selectedSquare &&
      this.state.boardState[this.state.selectedSquare.x][this.state.selectedSquare.y]
    );
  }

  private generateEmptyHighlightedMoves(): IPossibleMoves {
    const highlightedMoves = [];
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      const currRow = [];
      for (let y = 0; y < BOARD_WIDTH; y++) {
        const noMovesSquare: IPossibleMove = {
          canMove: false,
          canAttack: false,
          inAttackRange: false
        };
        currRow.push(noMovesSquare);
      }
      highlightedMoves.push(currRow);
    }
    return highlightedMoves;
  }

  // for now this would just be a normal do damage attack?...
  private onRangedAttack(clickedSquare: coordinate) {
    const clickedPiece = this.state.boardState[clickedSquare.x][clickedSquare.y];
  }

  private onMoveClick(clickedSquare: coordinate): void {
    const selectedSquare = this.state.selectedSquare;
    const clickedPiece = this.state.boardState[clickedSquare.x][clickedSquare.y];
    const selectedPiece = this.getSelectedPiece();

    // nothing to do
    if (!selectedPiece && !clickedPiece) {
      return;
    }

    // Select the clicked piece if none is currently selected
    if (!selectedPiece && clickedPiece != null) {
      return this.setState({
        selectedSquare: { ...clickedSquare },
        highlightState: this.generatePossibleMovesHighlights(clickedSquare, clickedPiece)
      });
    }

    const isMovePossible = this.state.highlightState[clickedSquare.x][clickedSquare.y].canMove;

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

  private getHoverIcon(hoveredSquare: coordinate): string {
    const selectedPiece = this.getSelectedPiece();
    if (!selectedPiece) {
      return "";
    }

    if (
      (selectedPiece as IRangedPiece).range &&
      this.state.highlightState[hoveredSquare.x][hoveredSquare.y].inAttackRange &&
      this.squareHasEnemyPiece(hoveredSquare, selectedPiece)
    ) {
      return "bow-icon";
    } else if (this.state.highlightState[hoveredSquare.x][hoveredSquare.y].canAttack) {
      return "sword-icon";
    } else if (this.state.highlightState[hoveredSquare.x][hoveredSquare.y].canMove) {
      return "boots-icon";
    } else {
      return "";
    }
  }

  private generatePossibleMovesHighlights(
    src: coordinate,
    selectedPiece: ISelectedPiece
  ): IPossibleMoves {
    const highlightedMoves = this.generateEmptyHighlightedMoves();
    if (!selectedPiece) {
      return highlightedMoves;
    }
    const dimensions: number[] = [-selectedPiece.moveRange, 0, selectedPiece.moveRange];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const dest = {
          x: this.getValidIndex(src.x + dimensions[x], BOARD_HEIGHT - 1),
          y: this.getValidIndex(src.y + dimensions[y], BOARD_WIDTH - 1)
        };
        const movesPath = getMovesPath(src, dest, this.state.boardState);

        for (let move of movesPath) {
          highlightedMoves[move.x][move.y].canMove = true;
          if (this.squareHasEnemyPiece(move, selectedPiece)) {
            highlightedMoves[move.x][move.y].canAttack = true;
          }
        }
      }
    }

    if ((selectedPiece as IRangedPiece).range) {
      const range = (selectedPiece as IRangedPiece).range;

      for (let x = Math.max(src.x - range, 0); x <= Math.min(src.x + range, BOARD_HEIGHT); x++) {
        for (let y = Math.max(src.y - range, 0); y <= Math.min(src.y + range, BOARD_WIDTH); y++) {
          highlightedMoves[x][y].inAttackRange = true;
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

  private squareHasEnemyPiece(square: coordinate, selectedPiece: IPiece): boolean {
    return (
      get(this, `state.boardState[${square.x}][${square.y}].player`, selectedPiece.player) !==
      selectedPiece.player
    );
  }
}
