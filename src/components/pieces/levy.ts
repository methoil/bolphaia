import BasePiece from "./piece";
import { coordinate } from "./IPieces";

import whiteLevyImageSvg from "../../resources/whitePawn.svg";
import blackLevyImageSvg from "../../resources/blackPawn.svg";

export default class Levy extends BasePiece {
  moveRange = 2;
  health = 2;
  attack = 1;

  getImageUrl() {
    return this.player === "slavs" ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}
