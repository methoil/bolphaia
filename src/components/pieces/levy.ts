import BasePiece from './piece';
import { coordinate } from './IPieces';

import whiteLevyImageSvg from "../../resources/whitePawn.svg";
import blackLevyImageSvg from "../../resources/blackPawn.svg";

export default class Levy extends BasePiece {
    moveRange = 2;
    
    getImageUrl() {
        return this.player === 'slavs' ? whiteLevyImageSvg : blackLevyImageSvg;
    }

    isMovePossible(src: coordinate, dest: coordinate): boolean {
        return Math.abs(dest.x - src.x) <= 1 && Math.abs(dest.y - src.y) <= 1;
    }
}