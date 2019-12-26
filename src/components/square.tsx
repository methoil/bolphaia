import * as React from "react";
import HealthBar from "./health-bar";
import { IPiece } from "./pieces/IPieces.model";

interface ISquareProps {
  cssClasses: string[];
  piece: IPiece | null;
  onMoveClick: () => any;
  getHoverIcon: () => any;
}

let hoverIcon: string = "";

export default class Square extends React.Component<ISquareProps, {}> {
  state: { hoverIcon: string };

  constructor(props: ISquareProps) {
    super(props);
    this.state = {
      hoverIcon: ""
    };
  }
  render() {
    return (
      <button
        className={`square ${this.props.cssClasses.join(" ")} ${this.state.hoverIcon}`}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.setHoverIconFromGameCallback.bind(this)}
        onMouseLeave={this.resetHoverIcon.bind(this)}
        style={{
          backgroundImage: `url(${this.props.piece && this.props.piece.getImageUrl()})` || ""
        }}
      >
        {this.props.piece ? (
          <HealthBar
            maxHealth={this.props.piece.maxHealth}
            remainingHealth={this.props.piece.health}
          ></HealthBar>
        ) : (
          ""
        )}
      </button>
    );
  }

  onClick(): void {
    this.props.onMoveClick();
    return this.setHoverIconFromGameCallback();
  }

  resetHoverIcon(): void {
    return this.setState({ hoverIcon: "" });
  }

  setHoverIconFromGameCallback(): void {
    return this.setState(state => {
      return { hoverIcon: this.props.getHoverIcon() };
    });
  }
}
