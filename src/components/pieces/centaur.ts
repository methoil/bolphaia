import whiteCentaurImageSvg from "../../resources/centaurWhite.svg";
import blackCentaurImageSvg from "../../resources/centaurBlack.svg";
import RangedPiece from "./rangedPiece";
import { playerIds, pieceTypes } from "../game/game.model";

export default class Centaur extends RangedPiece {
  readonly pieceType: pieceTypes = pieceTypes.centaur;
  moveRange: number = 6;
  health: number = 4;
  readonly maxHealth: number = 4;
  attack: number = 3;
  range: number = 4;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteCentaurImageSvg : blackCentaurImageSvg;
  }
}
