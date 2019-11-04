export type playerIds = 'slavs' | 'thracians';
export type coordinate = {
    x: number;
    y: number;
}

export interface IBasePiece {
    player: playerIds;
}

export interface IPiece extends IBasePiece {
    isMovePossible: (src: coordinate, dest: coordinate) => boolean;
}