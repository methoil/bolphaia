import BasePiece from './piece';
import { playerIds, pieceTypes } from '../game/game.model';
import whiteLevyImageSvg from '../../resources/legionWhite.svg';
import blackLevyImageSvg from '../../resources/legionBlack.svg';

export default class Legion extends BasePiece {
  pieceType: pieceTypes = pieceTypes.legion;
  moveRange: number = 1;
  health: number = 8;
  readonly maxHealth: number = 8;
  attack: number = 3;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteLevyImageSvg : blackLevyImageSvg;
  }
}
