import BasePiece from './piece';
import { playerIds, pieceTypes } from '../game.model';
import whiteLevyImageSvg from '../../resources/hopliteWhite.svg';
import blackLevyImageSvg from '../../resources/hopliteBlack.svg';

export default class Hoplite extends BasePiece {
  pieceType: pieceTypes = pieceTypes.hoplite;
  moveRange: number = 1;
  health: number = 8;
  readonly maxHealth: number = 8;
  attack: number = 3;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}
