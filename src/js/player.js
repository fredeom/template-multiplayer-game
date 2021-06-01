class Player {
  constructor() {
    this.privates = (() => {
      let id;
      let x;
      let y;
      let angle;
      return {
        setId: (value) => id = value,
        getId: () => id,
        setX: (value) => x = value,
        getX: () => x,
        setY: (value) => y = value,
        getY: () => y,
        getAngle: () => angle,
        setAngle: (value) => angle = value,
        toJSON: () => ({id, x, y, angle})
      }
    })();
    Object.keys(this.privates).forEach(k => {
      this[k] = this.privates[k];
    })
  }
  static fromJSON = (json) => {
    const player = new Player();
    player.setId(json.id);
    player.setX(json.x);
    player.setY(json.y);
    player.setAngle(json.angle);
    return player;
  }
}

module.exports = Player