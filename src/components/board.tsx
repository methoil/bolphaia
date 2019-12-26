import * as React from "react";

import "../index.scss";
import Square from "./square";
import { IBoardState, IPossibleMoves } from "./game";
import { coordinate, IPiece } from "./pieces/IPieces.model";

interface ISquare {
  style: string;
  shade: string;
  onMoveClick: () => any;
  getHoverIcon: () => any;
}
interface IBoardProps {
  boardState: IBoardState;
  highlightState: IPossibleMoves;
  onMoveClick: (clickedSquare: coordinate) => void;
  getHoverIcon: (clickedSquare: coordinate) => void;
}

export default class Board extends React.Component<IBoardProps, {}> {
  render() {
    const board = [];

    const xLength = this.props.boardState.length;
    const yLength = this.props.boardState[0].length;

    for (let i = 0; i < xLength; i++) {
      const squareRows = [];
      for (let j = 0; j < yLength; j++) {
        const cssClasses = [];
        cssClasses.push(
          (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square"
        );

        const piece = this.props.boardState[i][j];
        const squareHighlight = this.props.highlightState.length && this.props.highlightState[i][j];
        if (squareHighlight && squareHighlight.canMove) {
          cssClasses.push(
            squareHighlight.canAttack === true
              ? "highlighted-square-red"
              : "highlighted-square-green"
          );
        }
        if (squareHighlight && squareHighlight.inAttackRange) {
          cssClasses.push("highlighted-square-in-ranged-attack");
        }

        squareRows.push(this.renderSquare(i, j, cssClasses, piece));
      }
      board.push(
        <div key={i} className="board-row">
          {squareRows}
        </div>
      );
    }

    return <div>{board}</div>;
  }

  renderSquare(xIdx: number, yIdx: number, cssClasses: string[], piece: IPiece | null) {
    return (
      <Square
        key={xIdx * 8 + yIdx}
        cssClasses={cssClasses}
        piece={piece}
        onMoveClick={() => this.props.onMoveClick({ x: xIdx, y: yIdx })}
        getHoverIcon={() => this.props.getHoverIcon({ x: xIdx, y: yIdx })}
      />
    );
  }
}

function isEven(num: number): boolean {
  return num % 2 === 0;
}
