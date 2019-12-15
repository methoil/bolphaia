import BasePiece from "./piece";

export default abstract class RangedPiece extends BasePiece {
    abstract range: number = 0;
    // abstract accuracy: number ??
}