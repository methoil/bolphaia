import BasePiece from "./piece";
import { playerIds } from "../game.model";
import whiteLevyImageSvg from "../../resources/hopliteWhite.svg";
import blackLevyImageSvg from "../../resources/hopliteBlack.svg";

export default class Hoplite extends BasePiece {
  moveRange: number = 1;
  health: number = 8;
  readonly maxHealth: number = 8;
  attack: number = 3;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}