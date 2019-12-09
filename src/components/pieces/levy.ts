import BasePiece from "./piece";

import whiteLevyImageSvg from "../../resources/whitePawn.svg";
import blackLevyImageSvg from "../../resources/blackPawn.svg";

export default class Levy extends BasePiece {
  moveRange: number = 2;
  health: number = 2;
  readonly maxHealth: number = 2;
  attack: number = 1;

  getImageUrl() {
    return this.player === "slavs" ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}
