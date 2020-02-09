import * as React from 'react';
import { cloneDeep, findIndex, get, capitalize } from 'lodash';
import Pusher from 'pusher-js';
import axios from 'axios';

import '../index.scss';
import { playerIds, pieceTypes } from './game.model';
import Board from './board';
import levy from './pieces/levy';
import hoplite from './pieces/hoplite';
import { IPiece, coordinate, IRangedPiece } from './pieces/IPieces.model';
import Cataphract from './pieces/cataphract';
import { getMovesPath } from './pieces/piece.utils';
import Archer from './pieces/archer';
import RangedPiece from './pieces/rangedPiece';

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

let pusher;

interface IUpdateServerPayload {
  player: string; // userId??
  updatedSquares: ISquareUpdatePayload[];
}

interface ISquareUpdatePayload {
  row: number;
  col: number;
  piece: IPieceUpdatePayload | null;
}

interface IPieceUpdatePayload {
  player: playerIds | undefined;
  health: number | undefined;
  pieceType: string | undefined; // TODO: add enums
}

interface IGameState {
  turn: playerIds;
  boardState: IBoardState;
  highlightState: IPossibleMoves;
  selectedSquare: coordinate | null;
  mouseHoverIcon: string;
  playerSide?: playerIds;
  players?: { [key: string]: playerIds };
}

interface IGameProps {
  offlineMode: boolean;
  userId?: string;
  roomId?: string;
}

export default class Game extends React.Component<IGameProps, {}> {
  state: IGameState;

  render() {
    return (
      <div>
        <div className="current-turn-text">
          Current turn:&nbsp;
          <span style={{ color: this.state.turn === playerIds.phrygians ? 'white' : 'black' }}>
            {capitalize(this.state.turn)}
          </span>
        </div>
        <Board
          boardState={this.state.boardState}
          highlightState={this.state.highlightState}
          onMoveClick={this.onMoveClick.bind(this)}
          getHoverIcon={this.getHoverIcon.bind(this)}
        ></Board>
      </div>
    );
  }

  constructor(props) {
    // no props will be passed here?
    super(props);
    this.state = {
      turn: playerIds.phrygians,
      selectedSquare: null,
      boardState: this.initializeBoard(BOARD_HEIGHT, BOARD_WIDTH),
      highlightState: this.generateEmptyHighlightedMoves(),
      mouseHoverIcon: '',
    };

    if (!this.props.offlineMode) {
      pusher = new Pusher('6e48a6609db3a8a6b150', {
        cluster: 'mt1',
        forceTLS: true,
      });
    }
  }

  componentDidMount() {
    if (!this.props.offlineMode) {
      const channel = pusher.subscribe(`game-${this.props.roomId}`);
      channel.bind('board-updated', () => {
        this.updateGame();
      });
      this.setupGame();
    }
  }

  componentWillUnmount() {
    if (!this.props.offlineMode) {
      pusher.unsubscribe(`game-${this.props.roomId}`);
    }
  }

  public getPlayers() {
    return Object.keys(this.state.players || {});
  }

  private setupGame() {
    axios
      .request({
        url: 'http://localhost:4000/games/' + this.props.roomId,
      })
      .then(res => {
        if (res.data.players) {
          this.setState({ players: res.data.players });
          this.setState({ playerSide: res.data.players[this.props.userId ?? ''] });
          return;
        }
      });
  }

  private updateGame() {
    axios
      .request({
        url: 'http://localhost:4000/games/' + this.props.roomId,
      })
      .then(res => {
        // use same format as the sent payload and just update the changed squares
        if (res.data.player === this.props.userId) {
          return;
        }

        // TODO this code is the same thing copied twice ... make function
        // TODO: add type for this res
        const fromRow = res?.data?.updatedSquares?.[0].row;
        const fromColumn = res?.data?.updatedSquares?.[0].col;
        const fromPieceMeta = res?.data?.updatedSquares?.[0].piece;

        const toRow = res?.data?.updatedSquares?.[1].row;
        const toColumn = res?.data?.updatedSquares?.[1].col;
        const toPieceMeta = res?.data?.updatedSquares?.[1].piece;

        const newBoardState = cloneDeep(this.state.boardState);
        // TODO: need to create corrct piece -
        // type of uninstantiated class???
        const pieceNameToConstructorMap: { [key: string]: any } = {
          [pieceTypes.levy]: levy,
          [pieceTypes.hoplite]: hoplite,
          [pieceTypes.archer]: Archer,
          [pieceTypes.cataphract]: Cataphract,
        };

        const fromPiecePlacement = fromPieceMeta
          ? new pieceNameToConstructorMap[fromPieceMeta.pieceType](
              fromPieceMeta.player,
              fromPieceMeta.health,
            )
          : null;
        newBoardState[fromRow][fromColumn] = fromPiecePlacement;
        if (fromPiecePlacement) {
          fromPiecePlacement.setHealth(fromPieceMeta.health);
        }

        const toPiecePlacement = toPieceMeta
          ? new pieceNameToConstructorMap[toPieceMeta.pieceType](
              toPieceMeta.player,
              toPieceMeta.health,
            )
          : null;
        newBoardState[toRow][toColumn] = toPiecePlacement;
        if (toPiecePlacement) {
          toPiecePlacement.setHealth(toPieceMeta.health);
        }

        this.setState({
          boardState: newBoardState,
          turn: this.state.playerSide,
        });
      });
  }

  private initializeBoard(xSize: number, ySize: number): IBoardState {
    const boardState: Array<IPiece | null>[] = [];
    for (let x = 0; x < xSize; x++) {
      let pieceToPlace: IPiece | null = null;
      if (x === 1) {
        const rowArray: Array<IPiece | null> = new Array(ySize).fill(null);
        rowArray[2] = new Cataphract(playerIds.phrygians);
        rowArray[rowArray.length - 3] = new Cataphract(playerIds.phrygians);

        rowArray[4] = new Archer(playerIds.phrygians);
        rowArray[7] = new Archer(playerIds.phrygians);
        rowArray[10] = new Archer(playerIds.phrygians);
        rowArray[13] = new Archer(playerIds.phrygians);
        rowArray[16] = new Archer(playerIds.phrygians);
        rowArray[19] = new Archer(playerIds.phrygians);

        boardState.push(rowArray);
        continue;
      } else if (x === 2) {
        pieceToPlace = new hoplite(playerIds.phrygians);
      } else if (x === 3) {
        pieceToPlace = new levy(playerIds.phrygians);
      } else if (x === xSize - 4) {
        pieceToPlace = new levy(playerIds.hitites);
      } else if (x === xSize - 3) {
        pieceToPlace = new hoplite(playerIds.hitites);
      } else if (x === xSize - 2) {
        const rowArray = new Array(ySize).fill(null);
        rowArray[2] = new Cataphract(playerIds.hitites);
        rowArray[ySize - 3] = new Cataphract(playerIds.hitites);

        rowArray[4] = new Archer(playerIds.hitites);
        rowArray[7] = new Archer(playerIds.hitites);
        rowArray[10] = new Archer(playerIds.hitites);
        rowArray[13] = new Archer(playerIds.hitites);
        rowArray[16] = new Archer(playerIds.hitites);
        rowArray[19] = new Archer(playerIds.hitites);
        boardState.push(rowArray);
        continue;
      }

      boardState.push(new Array(ySize).fill(pieceToPlace));
    }

    return boardState;
  }

  private getSelectedPiece(): IPiece | null {
    return (
      this.state.selectedSquare &&
      this.state.boardState[this.state.selectedSquare.x][this.state.selectedSquare.y]
    );
  }

  private generateEmptyHighlightedMoves(): IPossibleMoves {
    const highlightedMoves: IPossibleMove[][] = [];
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      const currRow: IPossibleMove[] = [];
      for (let y = 0; y < BOARD_WIDTH; y++) {
        const noMovesSquare: IPossibleMove = {
          canMove: false,
          canAttack: false,
          inAttackRange: false,
        };
        currRow.push(noMovesSquare);
      }
      highlightedMoves.push(currRow);
    }
    return highlightedMoves;
  }

  private onMoveClick(clickedSquare: coordinate): void {
    // TODO: make visual indicator of this somewhere
    if (!this.props.offlineMode && this.state.turn !== this.state.playerSide) {
      return;
    }

    const selectedSquare = this.state.selectedSquare;
    const clickedPiece = this.state.boardState[clickedSquare.x][clickedSquare.y];
    const selectedPiece = this.getSelectedPiece();
    const isMovePossible = this.state.highlightState[clickedSquare.x][clickedSquare.y].canMove;

    // nothing to do
    if (!selectedPiece && !clickedPiece) {
      return;
    }

    // Select the clicked piece if none is currently selected
    else if (!selectedPiece && clickedPiece != null) {
      if (clickedPiece.player !== this.state.turn) {
        return;
      }

      return this.setState({
        selectedSquare: { ...clickedSquare },
        highlightState: this.generatePossibleMovesHighlights(clickedSquare, clickedPiece),
      });
    }

    // unselect piece when clicking on invalid move location
    else if (
      selectedPiece &&
      !isMovePossible &&
      !this.isTargetValidRangedAttack(clickedSquare, selectedPiece as RangedPiece)
    ) {
      return this.setState({
        selectedSquare: null,
        highlightState: this.generateEmptyHighlightedMoves(),
      });
    }

    const newBoardState = cloneDeep(this.state.boardState);
    let updateBoard = false;
    // layout of board may be changed in these cases, need to update server
    // case of ranged attack
    if (
      selectedPiece &&
      clickedPiece &&
      this.isTargetValidRangedAttack(clickedSquare, selectedPiece as RangedPiece)
    ) {
      clickedPiece.takeDamage(selectedPiece.attack);

      if (clickedPiece.health <= 0) {
        // TODO: move clicked piece to graveyard
        newBoardState[clickedSquare.x][clickedSquare.y] = null;
      } else {
        newBoardState[clickedSquare.x][clickedSquare.y] = clickedPiece;
      }
      updateBoard = true;
    }

    // Move the piece if a valid move is selected
    // includes doing damage
    else if (selectedPiece && selectedSquare && isMovePossible) {
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
            console.error('something went wrong.. should not happen.. crash imminent');
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

      updateBoard = true;
    }

    // execute move in one spot
    if (updateBoard) {
      if (!this.props.offlineMode) {
        const payload: IUpdateServerPayload = {
          player: this.props.userId ?? '',
          updatedSquares: this.getUpdateServerPayload(newBoardState, selectedSquare, clickedSquare),
        };
        axios.request({
          method: 'POST',
          url: 'http://localhost:4000/games/' + this.props.roomId,
          data: payload,
        });

        return this.setState({
          boardState: newBoardState,
          selectedSquare: null,
          highlightState: this.generateEmptyHighlightedMoves(),
          turn: this.getNewTurn(),
        });
      }
    }
  }

  private getNewTurn(): playerIds {
    return this.state.turn === playerIds.phrygians ? playerIds.hitites : playerIds.phrygians;
  }

  private getUpdateServerPayload(
    newBoardState: IBoardState,
    selectedSquare: coordinate | null,
    clickedSquare: coordinate | null,
  ): ISquareUpdatePayload[] {
    const fromPiecePayload =
      (selectedSquare &&
        newBoardState[selectedSquare.x][selectedSquare.y] && {
          player: newBoardState[selectedSquare.x][selectedSquare.y]?.player,
          health: newBoardState[selectedSquare.x][selectedSquare.y]?.health,
          pieceType: newBoardState[selectedSquare.x][selectedSquare.y]?.pieceType,
        }) ||
      null;
    const fromPayload: ISquareUpdatePayload = {
      row: selectedSquare?.x ?? -1,
      col: selectedSquare?.y ?? -1,
      piece: fromPiecePayload,
    };

    const toPiecePaylod =
      (clickedSquare &&
        newBoardState[clickedSquare.x][clickedSquare.y] && {
          player: newBoardState[clickedSquare.x][clickedSquare.y]?.player,
          health: newBoardState[clickedSquare.x][clickedSquare.y]?.health,
          pieceType: newBoardState[clickedSquare.x][clickedSquare.y]?.pieceType,
        }) ||
      null;
    const toPayload: ISquareUpdatePayload = {
      row: clickedSquare?.x ?? -1,
      col: clickedSquare?.y ?? -1,
      piece: toPiecePaylod,
    };

    return [fromPayload, toPayload];
  }

  private getHoverIcon(hoveredSquare: coordinate): string {
    const selectedPiece = this.getSelectedPiece();
    const hoveredPiece = get(
      this,
      `state.boardState[${hoveredSquare.x}][${hoveredSquare.y}]`,
      null,
    );
    if (!selectedPiece && hoveredPiece && hoveredPiece.player === this.state.turn) {
      return 'pointer-icon';
    } else if (!selectedPiece) {
      return '';
    }

    const hoveredSquareHighlights = this.state.highlightState[hoveredSquare.x][hoveredSquare.y];
    if (this.isTargetValidRangedAttack(hoveredSquare, selectedPiece as RangedPiece)) {
      return 'bow-icon';
    } else if (hoveredSquareHighlights.canAttack) {
      return 'sword-icon';
    } else if (hoveredSquareHighlights.canMove) {
      return 'boots-icon';
    } else {
      return '';
    }
  }

  private generatePossibleMovesHighlights(
    src: coordinate,
    selectedPiece: ISelectedPiece,
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
          y: this.getValidIndex(src.y + dimensions[y], BOARD_WIDTH - 1),
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

      for (
        let x = Math.max(src.x - range, 0);
        x <= Math.min(src.x + range, BOARD_HEIGHT - 1);
        x++
      ) {
        for (
          let y = Math.max(src.y - range, 0);
          y <= Math.min(src.y + range, BOARD_WIDTH - 1);
          y++
        ) {
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

  private isTargetValidRangedAttack(target: coordinate, selectedPiece: RangedPiece): boolean {
    // TODO: how could this resolve to 0??????
    return (
      !!(selectedPiece as IRangedPiece).range &&
      (this.state.highlightState[target.x][target.y]?.inAttackRange ?? false) &&
      this.squareHasEnemyPiece(target, selectedPiece)
    );
  }

  private squareHasEnemyPiece(square: coordinate, selectedPiece: IPiece): boolean {
    return (
      get(this, `state.boardState[${square.x}][${square.y}].player`, selectedPiece.player) !==
      selectedPiece.player
    );
  }
}
