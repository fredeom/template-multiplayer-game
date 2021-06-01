const { EVENT, GAME } = require('./types');

const initialState = {
  todo: null
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT.GAME.START: {
      return {...state, todo: GAME.SHOULD_START};
    }
    case EVENT.GAME.PLAY: {
      return {...state, todo: GAME.SHOULD_PLAY};
    }
    case EVENT.GAME.STOP: {
      return {...state, todo: GAME.SHOULD_STOP};
    }
    default: return state
  }
}

module.exports = gameReducer