import * as React from 'react';

import '../index.css';
import Square from './square';

interface ISquare { style: string, shade: string, onClick: () => any }
interface IBoard { squares: ISquare[] };
interface IBoardProps {board: string [][]};

export default class Board extends React.Component<IBoardProps, {}> {



  render() {
    const board = [];

    const xLength = this.props.board.length;
    const yLength = this.props.board[0].length;

    for (let i = 0; i < xLength; i++) {
      const squareRows = [];
      for (let j = 0; j < yLength; j++) {
        const squareShade = (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square";
        const backgroundImage = this.props.board[i][j] === 'L' ? '../Chess_plt45.svg' : 'none';
        squareRows.push(this.renderSquare((i * 8) + j, squareShade, backgroundImage));
      }
      board.push(<div key={i} className="board-row">{squareRows}</div>)
    }

    return (
      <div>
        {board}
      </div>
    );
  }

  renderSquare(id: number, squareShade: any, backgroundImage: string) {
    return <Square
      key={id}
      // piece = {this.props.squares[i]} 
      // style = {this.props.squares[i]? this.props.squares[i].style : null}
      shade={squareShade}
      background={backgroundImage}
    // onClick={() => this.props.onClick(i)}
    />
  }
}

function isEven(num: number): boolean {
  return num % 2 == 0
}