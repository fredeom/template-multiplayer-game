const net = require('net');
const { MSG } = require('./protocol');
const GameState = require('./gamestate');
const gamestate = new GameState(false);
const Player = require('./player');

class Client {
  constructor() {
    this.privates = (() => {
      let port = 5000;
      let host = 'localhost';
      let socket;

      const initPlayer = () => {
        socket.write(JSON.stringify({action: MSG.INIT_PLAYER}) + ',');
      }

      const updateMe = () => {
        socket.write(JSON.stringify({action: MSG.UPDATE_PLAYER, player: JSON.stringify(gamestate.getMe())}) + ',');
      }

      return {
        getPort: () => port,
        setPort: (value) => port = value,
        getHost: () => host,
        setHost: (value) => host = value,
        getGameState: () => gamestate,
        disconnect: () => socket.destroy(),
        connect: async () => {
          return new Promise((resolve, reject) => {
            gamestate.clear();
            if (socket) socket.destroy();
            socket = new net.Socket();
            socket.on('data', (data) => {
              const dataArr = '[' + data.slice(0, data.length - 1) + ']';
              try {
                const jsonArr = JSON.parse(dataArr);
                for (let json of jsonArr) {
                  switch (json.action) {
                    case MSG.INIT_PLAYER: {
                      const me = Player.fromJSON(JSON.parse(json.player));
                      gamestate.setMe(me);
                      resolve('resolve: ' + MSG.INIT_PLAYER);
                      break;
                    }
                    case MSG.UPDATE_PLAYERS: {
                      const players = JSON.parse(json.players).map(player => Player.fromJSON(player)).reduce((x, c) => {
                        x[c.getId()] = c;
                        return x;
                      }, {});
                      updateMe();
                      gamestate.updatePlayers(players);
                      break;
                    }
                    default: console.log('client: not implemented');
                  }
                }
              } catch (e) {
                alert('Recieved from server data (' + dataArr + ') ParseError: ' + e);
              }
            });
  
            socket.on('error', (err) => {
              reject(err);
            });
  
            socket.connect(port, host, () => {
              initPlayer();
            });
          });
        }
      }
    })();
    Object.keys(this.privates).forEach(k => {
      this[k] = this.privates[k];
    })
  }
}

module.exports = new Client();