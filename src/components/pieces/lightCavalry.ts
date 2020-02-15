import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteLightCavalryImageSvg from "../../resources/lightCavalryWhite.svg";
import blackLightCavalryImageSvg from "../../resources/lightCavalryBlack.svg";

export default class LightCavalry extends BasePiece {
  public pieceType = pieceTypes.lightCavalry;
  public moveRange: number = 7;
  public health: number = 4;
  readonly maxHealth: number = 4;
  public attack: number = 2;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteLightCavalryImageSvg : blackLightCavalryImageSvg;
  }
}
