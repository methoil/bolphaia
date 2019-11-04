import { playerIds, IBasePiece } from './IPieces';

export default class BasePiece implements IBasePiece {
    public player: playerIds;

    constructor(player: playerIds) {
        this.player = player;

    }
}