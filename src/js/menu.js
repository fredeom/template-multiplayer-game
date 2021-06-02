const { EVENT, VIEW, MENU } = require("./redux/types");

function setMenu(container, store, render) {
  [...container.children].forEach(el => {
    if (el.style) el.style.display = 'none';
  });
  const view = store.getState().main.view;
  if (view.length == 1) {
    let submenu1 = container.querySelector('#submenu1');
    if (!submenu1) {
      container.insertAdjacentHTML('beforeend', "<div id='submenu1' > \
        <button class='myButton'>Create Server</button> \
        <button class='myButton'>Connect Server</button> \
        <button class='myButton'>Quit</button> \
      </div>");
      submenu1 = container.querySelector('#submenu1');
      const buttons = submenu1.querySelectorAll('button');
      const createServerBtn = buttons[0];
      const connectServerBtn = buttons[1];
      const quitBtn = buttons[2];

      const onMenuClick = (submenu) => () => {
        store.dispatch({
          type: EVENT.CHANGE_VIEW,
          payload: [VIEW.MENU, submenu]
        });
        render();
      }
      createServerBtn.addEventListener('click', onMenuClick(MENU.CREATE_SERVER));
      connectServerBtn.addEventListener('click', onMenuClick(MENU.CONNECT_SERVER));
      quitBtn.addEventListener('click', () => nw.App.closeAllWindows());
    }
    submenu1.style.display = 'flex';
  } else {
    const onBackBtnClick = () => {
      store.dispatch({
        type: EVENT.CHANGE_VIEW,
        payload: [VIEW.MENU]
      });
      render();
    };
    switch (view[1]) {
      case MENU.CREATE_SERVER: {
        let submenu2 = container.querySelector('#submenu2');
        if (!submenu2) {
          container.insertAdjacentHTML('beforeend', "<div id='submenu2'> \
            <button class='myButton'>Start Server</button> \
            <label>Port: <input type='number' value='5000'/></label> \
            <button class='myButton'>Back</button> \
          </div>");
          submenu2 = container.querySelector('#submenu2');
          const buttons = submenu2.querySelectorAll('button');
          const inputs = submenu2.querySelectorAll('input');
          const startServerBtn = buttons[0];
          const backBtn = buttons[1];
          const portInp = inputs[0];

          startServerBtn.addEventListener('click', () => {
            store.dispatch({type: EVENT.SERVER.START, payload: portInp.value});
            store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.PLAYGROUND]});
            store.dispatch({type: EVENT.GAME.START});
            render();
          });
          backBtn.addEventListener('click', onBackBtnClick);
        }
        submenu2.style.display = 'flex';
        break;
      }
      case MENU.CONNECT_SERVER: {
        let submenu3 = container.querySelector('#submenu3');
        if (!submenu3) {
          container.insertAdjacentHTML('beforeend', "<div id='submenu3'> \
            <label>Host: <input value='localhost'/></label> \
            <label>Port: <input type='number' value='5000' /></label> \
            <button class='myButton'>Connect Server</button> \
            <button class='myButton'>Back</button> \
          </div>");
          submenu3 = container.querySelector('#submenu3');
          const buttons = submenu3.querySelectorAll('button');
          const inputs = submenu3.querySelectorAll('input');
          const connectServerBtn = buttons[0];
          const backBtn = buttons[1];
          const hostInp = inputs[0];
          const portInp = inputs[1];

          connectServerBtn.addEventListener('click', () => {
            store.dispatch({type: EVENT.SERVER.CONNECT, payload: {host: hostInp.value, port: portInp.value}});
            store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.PLAYGROUND]});
            store.dispatch({type: EVENT.GAME.START});
            render();
          });
          backBtn.addEventListener('click', onBackBtnClick);
        }
        submenu3.style.display = 'flex';
        break;
      }
      default: alert("Oops... no such menu view");
    }
  }
}

module.exports = setMenu;