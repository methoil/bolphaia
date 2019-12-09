import * as React from "react";
import HealthBar from "./health-bar";

export default function Square(props: any) {
  return (
    <button
      className={`square ${props.shade}`}
      onClick={props.onClick}
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
