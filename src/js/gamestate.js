const Player = require('./player');
const Wall = require('./wall');
const Bonuses = require('./bonuses');

class GameState {
  constructor(isServer) {
    this.privates = (() => {
      let players = {}; // PLAYERS
      let walls = [new Wall({id: 1, points: [[200, 200], [400, 200], [500, 400], [200, 400], [200, 200]]})];
      let bonuses;
      const cmds = {
        clear: () => {
          players = {};
          if (!isServer) {
            this.setMe(null);
          }
          bonuses = new Bonuses();
        },
        getWalls: () => walls,
        getBonuses: () => bonuses,
        getPlayers: () => players,
        updatePlayers: (value) => {
          players = value;
          players[this.getMe().getId()] = this.getMe();
        },
        deletePlayerById: (playerId) => {
          let playerToDel = players[playerId];
          delete players[playerId];
          return playerToDel;
        }
      }
      if (isServer) {
        cmds.getNewPlayer = () => {
          let newId = Math.max(0, ...Object.keys(players)) + 1;
          const player = new Player();
          player.setId(newId);
          player.setX(Math.round(Math.random() * 100) + 100);
          player.setY(Math.round(Math.random() * 100) + 100);
          player.setAngle(Math.round(Math.random() * 360));
          players[newId] = player;
          return player;
        };
      } else {
        let me; // ME
        cmds.setMe = (player) => {
          let prevMe;
          if (me) prevMe = this.deletePlayerById(me.getId());
          me = player;
          if (me) players[me.getId()] = me;
          return prevMe;
        }
        cmds.getMe = () => me;
      }
      return cmds;
    })();
    Object.keys(this.privates).forEach(k => {
      this[k] = this.privates[k];
    })
  }
}

module.exports = GameState;