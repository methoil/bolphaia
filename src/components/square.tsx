import * as React from "react";
import HealthBar from "./health-bar";
import { IPiece } from "./pieces/IPieces.model";

interface ISquareProps {
  cssClasses: string[];
  piece: IPiece | null;
  onMoveClick: () => any;
  getHoverIcon: () => any;
}

let hoverIcon: string = '';

export default function Square(props: ISquareProps) {
  return (
    <button
      className={`square ${props.cssClasses.join(" ")} ${hoverIcon}`}
      onClick={props.onMoveClick}
      onMouseEnter={() => {hoverIcon = props.piece ? '' : 'boots'; console.log(hoverIcon);}}
      onMouseLeave={() => {hoverIcon = ''; console.log(hoverIcon);}}
      style={{
        backgroundImage: `url(${props.piece && props.piece.getImageUrl()})` || "",
        // cursor: hoverIcon,
      }}
    >
      {props.piece ? (
        <HealthBar
          maxHealth={props.piece.maxHealth}
          remainingHealth={props.piece.health}
        ></HealthBar>
      ) : (
        ""
      )}
    </button>
  );
}
