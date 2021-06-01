const { VIEW, EVENT } = require('./types');

const initialState = {
  host: null,
  port: 5000
}

const serverReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT.SERVER.START: {
      const port = parseInt(action.payload);
      return {...state, port}
    }
    case EVENT.SERVER.CONNECT: {
      const host = action.payload.host;
      const port = parseInt(action.payload.port);
      return {...state, host, port}
    }
    default: return state
  }
}

module.exports = serverReducer;