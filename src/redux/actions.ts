import { IBoardState } from "../components/game";

export const setBoardState = (boardState: IBoardState) => ({
    type: 'SET_BOARD_STATE',
    boardState,
}) 