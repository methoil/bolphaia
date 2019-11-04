import * as React from 'react';

import '../index.css';
import Square from './square';

interface ISquare { style: string, shade: string, onClick: () => any }
interface IBoard { squares: ISquare[] };

export default class Board extends React.Component<IBoard, {}> {



  render() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const squareRows = [];
      for (let j = 0; j < 8; j++) {
        const squareShade = (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square";
        squareRows.push(this.renderSquare((i * 8) + j, squareShade));
      }
      board.push(<div key={i} className="board-row">{squareRows}</div>)
    }

    return (
      <div>
        {board}
      </div>
    );
  }

  renderSquare(id: number, squareShade: any) {
    return <Square
      key={id}
      // piece = {this.props.squares[i]} 
      // style = {this.props.squares[i]? this.props.squares[i].style : null}
      shade={squareShade}
    // onClick={() => this.props.onClick(i)}
    />
  }
}

function isEven(num: number): boolean {
  return num % 2 == 0
}