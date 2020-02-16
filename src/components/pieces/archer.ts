import whiteArcherImageSvg from "../../resources/archerWhite.svg";
import blackArcherImageSvg from "../../resources/archerBlack.svg";
import RangedPiece from "./rangedPiece";
import { playerIds, pieceTypes } from "../game/game.model";

export default class Archer extends RangedPiece {
  readonly pieceType: pieceTypes = pieceTypes.archer;
  moveRange: number = 2;
  health: number = 2;
  readonly maxHealth: number = 2;
  attack: number = 1;
  range: number = 3;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteArcherImageSvg : blackArcherImageSvg;
  }
}
