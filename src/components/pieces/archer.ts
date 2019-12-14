import BasePiece from "./piece";

import whiteArcherImageSvg from "../../resources/whiteArcher.svg";
import blackArcherImageSvg from "../../resources/blackArcher.svg";

export default class Archer extends BasePiece {
  moveRange: number = 2;
  health: number = 2;
  readonly maxHealth: number = 2;
  attack: number = 1;

  getImageUrl() {
    return this.player === "slavs" ? whiteArcherImageSvg : blackArcherImageSvg;
  }
}
