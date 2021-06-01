const EVENT = {
  CHANGE_VIEW : 'event/change_view',
  SERVER : {
    START: 'event/server/start',
    CONNECT: 'event/server/connect',
    STOP: 'event/server/stop',
  },
  GAME: {
    START: 'event/game/start',
    PLAY: 'event/game/play',
    STOP: 'event/game/stop'
  }
}

const VIEW = {
  START: 'view/start',
  MENU: 'view/menu',
  PLAYGROUND: 'view/playground'
}

const MENU = {
  CREATE_SERVER: 'view/menu/create_server',
  CONNECT_SERVER: 'view/menu/connect_server'
}

const GAME = {
  SHOULD_START : 'game/should_start',
  SHOULD_PLAY : 'game/should_play',
  SHOULD_STOP : 'game/should_stop'
}

module.exports = {
  EVENT, VIEW, MENU, GAME
};