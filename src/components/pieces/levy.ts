import Piece from './piece';
import { coordinate } from './IPieces';

export default class Levy extends Piece {

    isMovePossible(src: coordinate, dest: coordinate): boolean {
        return Math.abs(dest.x - src.x) <= 1 && Math.abs(dest.y - src.y) <= 1;
    }
}