import * as React from "react";

import "../index.css";
import Square from "./square";
import {IBoardState} from './game';

import levyImageSvg from "../Chess_plt45.svg";
interface ISquare {
  style: string;
  shade: string;
  onClick: () => any;
}
interface IBoardProps {
  boardState: IBoardState;
  onClick: (xIndex: number, yIndex: number) => void;
}

export default class Board extends React.Component<IBoardProps, {}> {
  render() {
    const board = [];

    const xLength = this.props.boardState.length;
    const yLength = this.props.boardState[0].length;

    for (let i = 0; i < xLength; i++) {
      const squareRows = [];
      for (let j = 0; j < yLength; j++) {
        const squareShade =
          (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
            ? "light-square"
            : "dark-square";

        const squareState = this.props.boardState[i][j];
        const backgroundImage = squareState === null ? 'none' : squareState.getImageUrl();
        squareRows.push(
          this.renderSquare(i * 8 + j, squareShade, backgroundImage)
        );
      }
      board.push(
        <div key={i} className="board-row">
          {squareRows}
        </div>
      );
    }

    return <div>{board}</div>;
  }

  renderSquare(id: number, squareShade: any, backgroundImage: string) {
    return (
      <Square
        key={id}
        // piece = {this.props.squares[i]}
        shade={squareShade}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        // onClick={() => this.props.onClick(i)}
      />
    );
  }
}

function isEven(num: number): boolean {
  return num % 2 == 0;
}
