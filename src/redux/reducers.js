export default gameReducers = (state = [], action) => {
  switch (action.type) {
    case "SET_BOARD_STATE":
      return [...state, { id: action.id, boardState: action.boardState }];
  }
};
