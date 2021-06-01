const { EVENT, VIEW } = require('src/js/redux/types');
const store = require('src/js/redux/store');
const setMenu = require('src/js/menu');
const playground = require('src/js/playground');
const {keys, mouse} = require('src/js/controls');

function render(container, store) {
  switch (store.getState().main.view[0]) {
    case VIEW.START: {
      container.innerHTML = "<button class='myButton'>Start Game</button>";
      const btnStartgame = container.querySelectorAll('button')[0];
      btnStartgame.addEventListener('click', () => {
        store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.MENU]});
        render(container, store);
      }, {once: true});
      break;
    }
    case VIEW.MENU: {
      setMenu(container, store, () => render(container, store));
      break;
    }
    case VIEW.PLAYGROUND: {
      playground.updateView(container, store, () => render(container, store));
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

  render(document.getElementById('main'), store);
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