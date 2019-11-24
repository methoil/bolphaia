import { IBoardState } from "../components/game";
import { ISelectedPiece } from "../components/game";

export const setBoardState = (boardState: IBoardState) => ({
  type: "SET_BOARD_STATE",
  boardState
});

export const setSelectedPiece = (selectedPiece: ISelectedPiece) => ({
  type: "SET_SELECTED_PIECE",
  selectedPiece
});
