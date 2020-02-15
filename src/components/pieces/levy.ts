import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteLevyImageSvg from "../../resources/levyWhite.svg";
import blackLevyImageSvg from "../../resources/levyBlack.svg";

export default class Levy extends BasePiece {
  pieceType = pieceTypes.levy;
  moveRange: number = 2;
  health: number = 2;
  readonly maxHealth: number = 2;
  attack: number = 1;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}
