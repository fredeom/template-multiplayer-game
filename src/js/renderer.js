function renderer(container, templateClassName, objects, classByIdFun) {           // objects = {<id>: {...}, <id>: {..}, ...}
  const objectKeys = Object.keys(objects);
  const oldIds = [];
  const oldElems = [...container.querySelectorAll('.' + templateClassName)].filter(elem => {
    const dataId = parseInt(elem.getAttribute('data-id'));
    const hasId = objectKeys.includes(dataId);
    if (hasId) oldIds.push(dataId); else elem.parentNode.removeChild(elem);
    return hasId;
  });
  const newElems = objectKeys.filter(key => !oldIds.includes(key)).map(key => {
    const newElem = document.createElement('div');
    newElem.classList.add(templateClassName);
    newElem.setAttribute('data-id', key);
    container.appendChild(newElem);
    return newElem;
  });
  [...oldElems, ...newElems].forEach(elem => {
    const id = parseInt(elem.getAttribute('data-id'));
    const obj = objects[id];
    elem.style.left = (obj.getX() - obj.getWidth() / 2) + 'px';
    elem.style.top = (obj.getY() - obj.getHeight() / 2) + 'px';
    elem.style.transform = 'rotate(' + obj.getAngle() + 'deg)';
    elem.classList.add(classByIdFun(id));
  });

}

module.exports = renderer;