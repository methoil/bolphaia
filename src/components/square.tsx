import * as React from "react";
import HealthBar from "./health-bar";
import { IPiece } from "./pieces/IPieces.model";

interface ISquareProps {
  cssClasses: string[];
  piece: IPiece | null;
  onMoveClick: () => any;
}

export default function Square(props: ISquareProps) {
  return (
    <button
      className={`square ${props.cssClasses.join(" ")}`}
      onClick={props.onMoveClick}
      style={{ backgroundImage: `url(${props.piece && props.piece.getImageUrl()})` || "" }}
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
