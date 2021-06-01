const net = require('net');
const { MSG } = require('./protocol');
const GameState = require('./gamestate');
const gamestate = new GameState(true);
const Player = require('./player');

class Server {
  constructor() {
    this.privates = (() => {
      let port = 5000;
      let server;
      let sockets = {};
      let updateTimeout;
      const cmds = {
        getPort: () => port,
        setPort: (value) => port = value,
        createServer: () => {
          setTimeout(cmds.updateState, 10000);
          gamestate.clear();
          for (let id in sockets) {
            sockets[id].destroy();
          }
          sockets = {};
          if (server) server.close();
          server = net.createServer((socket) => {
            let player;
            socket.on('data', (data) => {
              data = (data + '').trim();
              const dataArr = '[' + data.slice(0, data.length - 1) + ']';
              try {
                const jsonArr = JSON.parse(dataArr);
                for (let json of jsonArr) {
                  switch (json.action) {
                    case MSG.INIT_PLAYER: {
                      player = gamestate.getNewPlayer();
                      sockets[player.getId()] = socket;
                      socket.write(JSON.stringify({action: MSG.INIT_PLAYER, player: JSON.stringify(player.toJSON())}) + ',');
                      break;
                    }
                    case MSG.UPDATE_PLAYER: {
                      const me = Player.fromJSON(JSON.parse(json.player));
                      gamestate.getPlayers()[me.getId()] = me;
                      break;
                    }
                    default: console.log('server: not implemented');
                  }
                }
              } catch (e) {
                alert('Server: ' + e + ' data: ' + dataArr);
              }
            });
            socket.on('close', () => {
              const id = Object.keys(sockets).find(key => sockets[key] === socket);
              if (id) delete sockets[id];
              gamestate.deletePlayerById(id);
            });
          });
          server.listen(port, 'localhost');
        }
      }
      cmds.updateState = () => {
        try {
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
          for (let id in sockets) {
            sockets[id].write(JSON.stringify({
              action: MSG.UPDATE_PLAYERS,
              players: JSON.stringify(Object.values(gamestate.getPlayers()).map(player => player.toJSON()))
            }) + ',');
          }
          updateTimeout = setTimeout(cmds.updateState, 20);
        } catch (e) {
          alert('some shit ' + e);
        }
      }
      return cmds;
    })();
    Object.keys(this.privates).forEach(k => {
      this[k] = this.privates[k];
    })
  }
}

module.exports = new Server();