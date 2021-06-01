const { VIEW, EVENT } = require('./types');

const initialState = {
  view: [VIEW.START]
}

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT.CHANGE_VIEW: return {...state, view: action.payload}
    default: return state
  }
}

module.exports = mainReducer;