export type playerIds = 'slavs' | 'thracians';
export type coordinate = {
    x: number;
    y: number;
}

export interface IBasePiece {
    player: playerIds;
    isSelected: boolean;
}

export interface IPiece extends IBasePiece {
    moveRange: number;
    getImageUrl: () => string;
    isMovePossible: (src: coordinate, dest: coordinate) => boolean;
    getMovesPath?: (src: coordinate, dest: coordinate) => coordinate[];
}