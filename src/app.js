const { EVENT, VIEW } = require('src/js/redux/types');
const store = require('src/js/redux/store');
const setMenu = require('src/js/menu');
const playground = require('src/js/playground');
const {keys, mouse} = require('src/js/controls');

function render(container, store, renderState) {
  [...container.children].forEach(el => {
    if (el.style) el.style.display = 'none';
  });
  switch (store.getState().main.view[0]) {
    case VIEW.START: {
      let start = container.querySelector('#start');
      if (!start) {
        start = document.createElement('div');
        start.setAttribute('id', 'start');
        start.innerHTML = "<button class='myButton'>Start Game</button>";
        start.querySelector('button').addEventListener('click', () => {
          store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.MENU]});
          render(container, store, renderState);
        });
        container.appendChild(start);
      }
      start.style.display = 'block';
      break;
    }
    case VIEW.MENU: {
      let menu = container.querySelector('#menu');
      if (!menu) {
        menu = document.createElement('div');
        menu.setAttribute('id', 'menu');
        container.appendChild(menu);
      }
      menu.style.display = 'block';
      setMenu(menu, store, renderState);
      break;
    }
    case VIEW.PLAYGROUND: {
      let playgroundContainer = container.querySelector('#playground');
      if (!playgroundContainer) {
        playgroundContainer = document.createElement('div');
        playgroundContainer.setAttribute('id', 'playground');
        container.appendChild(playgroundContainer);
      }
      playgroundContainer.style.display = 'block';
      playground.updateView(playgroundContainer, store, renderState);
      break;
    }
    default: alert('render unknown view');
  }
}

function initControlEvents() {
  document.addEventListener("keydown", (e) => {
    keys.add(e.key.toLowerCase());
  });
  
  document.addEventListener("keyup", (e) => {
    keys.delete(e.key.toLowerCase());
  });

  function unFocus() {
    if (document.selection) {
      document.selection.empty()
    } else {
      window.getSelection().removeAllRanges()
    }
  }

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    unFocus();
  });

  function setButtons(e) {
    mouse.button1 = (e.buttons & 1) === 1;
    mouse.button2 = (e.buttons & 2) === 2;
  }

  document.addEventListener("mousedown", setButtons);

  document.addEventListener("mouseup", (e) => {
    setButtons(e);
    unFocus();
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

document.addEventListener("DOMContentLoaded", function(event) {
  store.subscribe(() => console.log(store.getState()));

  initControlEvents();

  const main = document.getElementById('main');

  const renderState = () => render(main, store, renderState);

  render(main, store, renderState);
});

//////////////////////////////////////////////
nw.Window.get().enterFullscreen();

nw.App.registerGlobalHotKey(
  new nw.Shortcut({
    key: "Escape",
    active: () => nw.Window.get().leaveFullscreen()
  })
);
//////////////////////////////////////////////