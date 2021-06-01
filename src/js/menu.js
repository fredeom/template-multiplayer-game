const { EVENT, VIEW, MENU } = require("./redux/types");

function setMenu(container, store, render) {
  const view = store.getState().main.view;
  if (view.length == 1) {
    container.innerHTML =
    "<div style='display: flex; flex-flow: column nowrap; justify-content: flex-start; align-items: stretch; height: 100px;'> \
      <button style='margin-top: 10px;' class='myButton'>Create Server</button> \
      <button style='margin-top: 10px;' class='myButton'>Connect Server</button> \
      <button style='margin-top: 10px;' class='myButton'>Quit</button> \
    </div>";
    const buttons = container.querySelectorAll('button');
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
    createServerBtn.addEventListener('click', onMenuClick(MENU.CREATE_SERVER), {once: true});
    connectServerBtn.addEventListener('click', onMenuClick(MENU.CONNECT_SERVER), {once: true});
    quitBtn.addEventListener('click', () => nw.App.closeAllWindows(), {once: true})
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
        container.innerHTML =
        "<div style='display: flex; flex-flow: column nowrap; justify-content: flex-start; align-items: flex-start; height: 100px;'> \
          <button class='myButton'>Start Server</button> \
          <label  style='margin-top: 10px;'>Port: <input type='number' value='5000' style='max-width: 50px;' /></label> \
          <button style='margin-top: 10px;'class='myButton'>Back</button> \
        </div>";
        const buttons = container.querySelectorAll('button');
        const inputs = container.querySelectorAll('input');
        const startServerBtn = buttons[0];
        const backBtn = buttons[1];
        const portInp = inputs[0];

        startServerBtn.addEventListener('click', () => {
          store.dispatch({type: EVENT.SERVER.START, payload: portInp.value});
          store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.PLAYGROUND]});
          store.dispatch({type: EVENT.GAME.START});
          render();
        }, {once: true});
        backBtn.addEventListener('click', onBackBtnClick, {once: true});
        break;
      }
      case MENU.CONNECT_SERVER: {
        container.innerHTML =
        "<div style='display: flex; flex-flow: column nowrap; justify-content: flex-start; align-items: flex-start; height: 100px;'> \
          <label>Host: <input value='localhost' style='max-width: 100px;' /></label> \
          <label  style='margin-top: 10px;'>Port: <input type='number' value='5000' style='max-width: 50px;' /></label> \
          <button style='margin-top: 10px;' class='myButton'>Connect Server</button> \
          <button style='margin-top: 10px;' class='myButton'>Back</button> \
        </div>";
        const buttons = container.querySelectorAll('button');
        const inputs = container.querySelectorAll('input');
        const connectServerBtn = buttons[0];
        const backBtn = buttons[1];
        const hostInp = inputs[0];
        const portInp = inputs[1];

        connectServerBtn.addEventListener('click', () => {
          store.dispatch({type: EVENT.SERVER.CONNECT, payload: {host: hostInp.value, port: portInp.value}});
          store.dispatch({type: EVENT.CHANGE_VIEW, payload: [VIEW.PLAYGROUND]});
          store.dispatch({type: EVENT.GAME.START});
          render();
        }, {once: true});
        backBtn.addEventListener('click', onBackBtnClick, {once: true});
        break;
      }
      default: alert("Oops... no such menu view");
    }
  }
}

module.exports = setMenu;