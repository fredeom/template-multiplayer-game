const { VIEW, GAME, EVENT } = require('./redux/types');

const server = require('./server');
const client = require('./client');

const { keys, mouse } = require('./controls');

function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

const wallBumpSoundPlay = debounce(() => new Audio('src/media/wall_bump.wav').play(), 100);

const playground = {
  updateView : (container, store, render) => {
    switch (store.getState().game.todo) {
      case GAME.SHOULD_START: {
        container.innerHTML = "loading...";
        const serverState = store.getState().server;
        switch (serverState.host) {
          case null: {
            server.setPort(serverState.port);
            server.createServer();
            break;
          }
          default: console.log('here we connect server ' + serverState.host + ":" + serverState.port);
        }
        client.setPort(serverState.port);
        client.setHost(serverState.host);
        client.connect().then(() => {
          store.dispatch({type: EVENT.GAME.PLAY});
          container.innerHTML = "PLAY";
          render();
        }).catch(err => {
          alert('Playground error: ' + err);
          store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.MENU]});
          render();
        });
        break;
      }
      case GAME.SHOULD_PLAY: {
        container.innerHTML = "playing: Keys: " + ([...keys].join(' ')) + " Mouse X: " + mouse.x + " Y: " + mouse.y + " button1: " + mouse.button1 + " button2: " + mouse.button2;
        const gamestate = client.getGameState();
        const walls = gamestate.getWalls();
        const players = gamestate.getPlayers();
        const me = gamestate.getMe();
        const ids = Object.keys(players);
        const oldIds = [];

        const elems = [...container.querySelectorAll('.man')].filter(elem => {
          const dataId = parseInt(elem.getAttribute('data-id'));
          const hasId = ids.includes(dataId);
          if (hasId) oldIds.push(dataId); else elem.parentNode.removeChild(elem);
          return hasId;
        });

        const newElems = ids.filter(id => !oldIds.includes(id)).map(id => {
          const newElem = document.createElement('div');
          newElem.classList.add('man');
          newElem.setAttribute('data-id', id);
          container.appendChild(newElem);
          return newElem;
        });

        [...elems, ...newElems].forEach(elem => {
          const id = parseInt(elem.getAttribute('data-id'));
          const p = players[id];
          elem.style.left = (p.getX() - 10) + 'px';
          elem.style.top = (p.getY() - 10) + 'px';
          elem.style.transform = 'rotate(' + p.getAngle() + 'deg)';
          if (p === me) elem.style.background = 'green';
        });

        if (keys.has('q')) {
          store.dispatch({type: EVENT.GAME.STOP});
        }

        let dx = 0, dy = 0;
        if (keys.has('a') && !keys.has('d')) dx = -1;
        if (!keys.has('a') && keys.has('d')) dx = +1;
        if (keys.has('w') && !keys.has('s')) dy = -1;
        if (!keys.has('w') && keys.has('s')) dy = +1;

        let isValid = true;
        for (let wall of walls) {
          if (wall.isIntersect(me.getX() + dx, me.getY() + dy)) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          me.setX(me.getX() + dx);
          me.setY(me.getY() + dy);
        } else wallBumpSoundPlay();

        me.setAngle(Math.round(Math.atan2(mouse.y - me.getY(), mouse.x - me.getX()) * 180 / Math.PI) + 90);

        walls.forEach(wall => wall.draw(container));

        setTimeout(render, 1000 / 60);
        break;
      }
      case GAME.SHOULD_STOP: {
        client.disconnect();
        client.getGameState().clear();
        store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.MENU]});
        render();
        break;
      }
      default: alert('playground.updateView nothing to do');
    }
  }
}

module.exports = playground