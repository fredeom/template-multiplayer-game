const { createStore, combineReducers } = require('redux');
const mainReducer = require('./mainReducer');
const serverReducer = require('./serverReducer');
const gameReducer = require('./gameReducer');

const store = createStore(combineReducers({
  main: mainReducer,
  server: serverReducer,
  game: gameReducer
}));

module.exports = store;