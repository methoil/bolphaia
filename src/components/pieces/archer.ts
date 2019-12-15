import whiteArcherImageSvg from "../../resources/whiteArcher.svg";
import blackArcherImageSvg from "../../resources/blackArcher.svg";
import RangedPiece from "./rangedPiece";

export default class Archer extends RangedPiece {
  moveRange: number = 2;
  health: number = 2;
  readonly maxHealth: number = 2;
  attack: number = 1;
  range: number = 4;

  getImageUrl() {
    return this.player === "slavs" ? whiteArcherImageSvg : blackArcherImageSvg;
  }
}
