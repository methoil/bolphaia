import * as React from "react";

import "../index.scss";
import Square from "./square";
import { IBoardState } from "./game";
import { coordinate, IPiece } from "./pieces/IPieces.model";

interface ISquare {
  style: string;
  shade: string;
  onClick: () => any;
}
interface IBoardProps {
  boardState: IBoardState;
  highlightState: boolean[][];
  onClick: (clickedSquare: coordinate) => void;
}

export default class Board extends React.Component<IBoardProps, {}> {
  render() {
    const board = [];

    const xLength = this.props.boardState.length;
    const yLength = this.props.boardState[0].length;

    for (let i = 0; i < xLength; i++) {
      const squareRows = [];
      for (let j = 0; j < yLength; j++) {
        let squareShade =
          (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square";

        const piece = this.props.boardState[i][j];
        if (this.props.highlightState.length && this.props.highlightState[i][j]) {
          squareShade = piece !== null ? "highlighted-square-red" : "highlighted-square-green";
        }

        squareRows.push(this.renderSquare(i, j, squareShade, piece));
      }
      board.push(
        <div key={i} className="board-row">
          {squareRows}
        </div>
      );
    }

    return <div>{board}</div>;
  }

  renderSquare(xIdx: number, yIdx: number, squareShade: any, piece: IPiece | null) {
    return (
      <Square
        key={xIdx * 8 + yIdx}
        shade={squareShade}
        piece={piece}
        onClick={() => this.props.onClick({ x: xIdx, y: yIdx })}
      />
    );
  }
}

function isEven(num: number): boolean {
  return num % 2 === 0;
}
