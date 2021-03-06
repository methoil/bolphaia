import { capitalize, cloneDeep, findIndex, get, isEqual } from 'lodash';
import Pusher from 'pusher-js';
import * as React from 'react';
import '../../index.scss';
import { IPiece, generatePiece } from './pieces/piece';
import {
  generatePossibleMovesHighlights,
  getMovesPath,
  generateEmptyHighlightedMoves,
  isTargetValidRangedAttack,
} from './services/moveHighlightSvc';
import gameRequestsSvc from './services/gameRequestsSvc';
import Board from './board';
import { pieceTypes, playerIds, coordinate } from './game.model';
import { generateNewBoard, IPieceMeta, BOARD_WIDTH, BOARD_HEIGHT } from './services/boardSetup';
import SelectedPieceStats from './selectedPieceStats';
import Cemetery from './cemetery';

export type IPossibleMove = {
  canMove: boolean;
  canAttack: boolean;
  inAttackRange: boolean;
};
export type IPossibleMoves = IPossibleMove[][];
export type ISelectedPiece = IPiece | null;
export type IBoardState = (IPiece | null)[][];

let pusher;

interface IUpdateServerPayload {
  player: string; // userId
  newTurn: playerIds;
  updatedSquares: ISquareUpdatePayload[];
  fallenPieces: IFallenPiecesStruct;
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

export type IFallenPiecesStruct = { [key in playerIds]: { [key in pieceTypes]: number } };

interface IGameState {
  turn: playerIds;
  boardState: IBoardState;
  highlightState: IPossibleMoves;
  selectedSquare: coordinate | null;
  hoveredPiece: IPiece | null;
  mouseHoverIcon: string;
  fallenPieces: IFallenPiecesStruct;
  playerSide?: playerIds;
  players?: { [key: string]: playerIds };
}

interface IGameProps {
  offlineMode: boolean;
  userId?: string;
  roomId?: string;
  startGameCallback?: () => Promise<void>;
}

export default class Game extends React.Component<IGameProps, {}> {
  state: IGameState;

  render() {
    return (
      <div className="game-container">
        <div className="turn-status-ribbon">
          {this.state.playerSide ? (
            <span style={{ marginRight: '10px' }}>
              You are {this.props.userId} of the
              <span
                style={{ color: this.state.playerSide === playerIds.phrygians ? 'white' : 'black' }}
              >
                &nbsp;{capitalize(this.state.playerSide)}
              </span>{' '}
            </span>
          ) : (
            ''
          )}
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
        <span className="board-sidebar">
          <SelectedPieceStats
            piece={this.getSelectedPiece() || this.state.hoveredPiece || null}
          ></SelectedPieceStats>
          <Cemetery fallenPieces={this.state.fallenPieces}></Cemetery>
        </span>
      </div>
    );
  }

  constructor(props) {
    super(props);
    const fallenPieces: any = { [playerIds.phrygians]: {}, [playerIds.hittites]: {} };
    for (let player in playerIds) {
      for (let piece in pieceTypes) {
        fallenPieces[player][piece] = 0;
      }
    }
    this.state = {
      turn: playerIds.phrygians,
      selectedSquare: null,
      hoveredPiece: null,
      fallenPieces: fallenPieces,
      boardState: props.offlineMode ? this.buildBoardState(generateNewBoard()) : [[]],
      highlightState: generateEmptyHighlightedMoves(),
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
        const updateGameSateCb = res => {
          if ((res.data.players && !this.state.players) || !this.state.playerSide) {
            this.setState({ players: res.data.players });
            this.setState({ playerSide: res.data.players[this.props.userId ?? ''] });
          }
          // using same format as the sent payload and just update the changed squares for now
          if (res.data.player === this.props.userId) {
            return;
          }

          this.setState({
            boardState: this.buildBoardState(res.data.board),
            turn: res.data.nextTurn || this.state.playerSide,
            fallenPieces: res.data.fallenPieces || this.state.fallenPieces,
          });
        };

        gameRequestsSvc.updateGame(this.props.roomId, updateGameSateCb);
      });

      const setupGameStateCb = res => {
        this.setState({
          players: res.data.players || this.state.players,
          playerSide: res.data.players[this.props.userId ?? ''] || this.state.playerSide,
          boardState: this.buildBoardState(res.data.board),
          turn: res.data.nextTurn || this.state.playerSide,
          fallenPieces: res.data.fallenPieces || this.state.fallenPieces,
        });
      };
      // TODO: use TS argument types: https://stackoverflow.com/questions/52771626/typescript-react-conditionally-optional-props-based-on-the-type-of-another-prop
      // for startGameCallback .. ?
      gameRequestsSvc.setupGame(this.props.roomId, setupGameStateCb, this.props.startGameCallback);
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

  private buildBoardState(newBoardMeta: Array<IPieceMeta | null>[]): IBoardState {
    const boardState: Array<IPiece | null>[] = [];

    for (let x = 0; x < BOARD_HEIGHT; x++) {
      const row: Array<IPiece | null> = [];
      for (let y = 0; y < BOARD_WIDTH; y++) {
        row[y] = this.makePieceFromMeta(newBoardMeta[x][y]);
      }
      boardState.push(row);
    }

    return boardState;
  }

  private makePieceFromMeta(squareMata: IPieceMeta | null): IPiece | null {
    let fromPiecePlacement: IPiece | null = null;
    if (squareMata?.pieceType) {
      fromPiecePlacement = generatePiece(
        squareMata.pieceType,
        squareMata?.player,
        squareMata?.health,
      );
    }

    return fromPiecePlacement;
  }

  private getSelectedPiece(): IPiece | null {
    return (
      this.state.selectedSquare &&
      this.state.boardState[this.state.selectedSquare.x][this.state.selectedSquare.y]
    );
  }

  private onMoveClick(clickedSquare: coordinate): void {
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
        highlightState: generatePossibleMovesHighlights(
          clickedSquare,
          clickedPiece,
          this.state.boardState,
        ),
      });
    }

    // unselect piece when clicking on invalid move location
    else if (
      selectedPiece &&
      !isMovePossible &&
      !isTargetValidRangedAttack(
        clickedSquare,
        selectedPiece,
        this.state.highlightState,
        this.state.boardState,
      )
    ) {
      return this.setState({
        selectedSquare: null,
        highlightState: generateEmptyHighlightedMoves(),
      });
    }

    const newBoardState = cloneDeep(this.state.boardState);
    const newFallenPieces = cloneDeep(this.state.fallenPieces);
    let updateBoard = false;
    const squaresToUpdate: coordinate[] = [];
    // layout of board may be changed in these cases, need to update server
    // case of ranged attack
    if (
      selectedPiece &&
      selectedSquare &&
      clickedPiece &&
      clickedSquare &&
      isTargetValidRangedAttack(
        clickedSquare,
        selectedPiece,
        this.state.highlightState,
        this.state.boardState,
      )
    ) {
      if (clickedPiece.pieceType === pieceTypes.legion) {
        clickedPiece.takeDamage(1);
      } else if (clickedPiece.pieceType === pieceTypes.warElephant) {
        clickedPiece.takeDamage(selectedPiece.attack * 2);
      } else {
        clickedPiece.takeDamage(selectedPiece.attack);
      }

      if (clickedPiece.health <= 0) {
        newFallenPieces[clickedPiece.player][clickedPiece.pieceType] += 1;
        newBoardState[clickedSquare.x][clickedSquare.y] = null;
      } else {
        newBoardState[clickedSquare.x][clickedSquare.y] = clickedPiece;
      }
      squaresToUpdate.push(...[selectedSquare, clickedSquare]);
      updateBoard = true;
    }

    // Move the piece if a valid move is selected
    // includes doing damage
    else if (selectedPiece && selectedSquare && isMovePossible) {
      if (isEqual(selectedSquare, clickedSquare)) {
        // do not skip turn if you don't move the piece
        return this.setState({
          selectedSquare: null,
          highlightState: generateEmptyHighlightedMoves(),
        });
      }
      // combat occurs on destination arrival
      if (clickedPiece && clickedPiece !== selectedPiece) {
        // levvy surround bonus
        if (selectedPiece.pieceType === pieceTypes.levy) {
          let surroundLevyCount = 1;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              const dest = {
                x: clickedSquare.x + x,
                y: clickedSquare.y + y,
              };
              if (
                clickedSquare.x + x < 0 ||
                clickedSquare.x + x > BOARD_HEIGHT - 1 ||
                clickedSquare.y + y < 0 ||
                clickedSquare.y + y > BOARD_WIDTH - 1 ||
                (dest.x === selectedSquare.x && dest.y === selectedSquare.y)
              ) {
                continue; // just the square the piece is on
              }

              if (isEqual(dest, selectedSquare)) {
                continue;
              }
              const checkedPiece = newBoardState[dest.x][dest.y];
              if (
                checkedPiece?.pieceType === pieceTypes.levy &&
                checkedPiece?.player === this.state.turn
              ) {
                surroundLevyCount++;
              }
            }
          }
          clickedPiece.takeDamage(Math.floor(surroundLevyCount));
        } else {
          clickedPiece.takeDamage(selectedPiece.attack);
        }

        if (clickedPiece.health <= 0) {
          newFallenPieces[clickedPiece.player][clickedPiece.pieceType] += 1;
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
          squaresToUpdate.push(dest);
        }
      } else {
        newBoardState[selectedSquare.x][selectedSquare.y] = null;
        newBoardState[clickedSquare.x][clickedSquare.y] = selectedPiece;
      }
      squaresToUpdate.push(...[selectedSquare, clickedSquare]);
      updateBoard = true;
    }

    // execute move in one spot
    if (updateBoard) {
      if (!this.props.offlineMode) {
        const payload: IUpdateServerPayload = {
          player: this.props.userId ?? '',
          newTurn: this.getNewTurn(),
          fallenPieces: newFallenPieces,
          updatedSquares: this.getUpdateServerPayload(newBoardState, squaresToUpdate),
        };
        gameRequestsSvc.sendMove(this.props.roomId, payload);
      }

      return this.setState({
        boardState: newBoardState,
        selectedSquare: null,
        highlightState: generateEmptyHighlightedMoves(),
        fallenPieces: newFallenPieces,
        turn: this.getNewTurn(),
      });
    }
  }

  private getNewTurn(): playerIds {
    return this.state.turn === playerIds.phrygians ? playerIds.hittites : playerIds.phrygians;
  }

  private getUpdateServerPayload(
    newBoardState: IBoardState,
    squaresToUpdate: coordinate[],
  ): ISquareUpdatePayload[] {
    const payloads: ISquareUpdatePayload[] = [];
    for (let square of squaresToUpdate) {
      let fromPiecePayload: IPieceUpdatePayload | null = null;
      if (square && newBoardState[square.x][square.y]) {
        fromPiecePayload = {
          player: newBoardState[square.x][square.y]?.player,
          health: newBoardState[square.x][square.y]?.health,
          pieceType: newBoardState[square.x][square.y]?.pieceType,
        };
      }

      const fromPayload: ISquareUpdatePayload = {
        row: square?.x ?? -1,
        col: square?.y ?? -1,
        piece: fromPiecePayload,
      };
      payloads.push(fromPayload);
    }

    return payloads;
  }

  private getHoverIcon(hoveredSquare: coordinate): string {
    const selectedPiece = this.getSelectedPiece();
    const hoveredPiece = get(
      this,
      `state.boardState[${hoveredSquare.x}][${hoveredSquare.y}]`,
      null,
    );

    this.setState({
      hoveredPiece: hoveredPiece,
    });

    if (
      !selectedPiece &&
      hoveredPiece &&
      hoveredPiece.player === this.state.turn &&
      !(!this.props.offlineMode && this.state.playerSide !== hoveredPiece.player)
    ) {
      return 'pointer-icon';
    } else if (!selectedPiece) {
      return '';
    }

    const hoveredSquareHighlights = this.state.highlightState[hoveredSquare.x][hoveredSquare.y];
    if (
      isTargetValidRangedAttack(
        hoveredSquare,
        selectedPiece,
        this.state.highlightState,
        this.state.boardState,
      )
    ) {
      return 'bow-icon';
    } else if (hoveredSquareHighlights.canAttack) {
      return 'sword-icon';
    } else if (hoveredSquareHighlights.canMove) {
      return 'boots-icon';
    } else {
      return '';
    }
  }
}
