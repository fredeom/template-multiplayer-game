class Wall {
  constructor(props) {
    this.id = props.id;
    this.points = props.points;
  }
  draw = (container) => {
    let wall = container.querySelectorAll('.wall[data-id="' + this.id + '"]')[0];
    if (!wall) {
      wall = document.createElement('div');
      wall.classList.add('wall');
      wall.setAttribute('data-id', this.id);
      container.appendChild(wall);
    }
    wall.innerHTML = '';

    function drawLine (wall, p1, p2) {
      const angle = Math.round(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI);
      const line = document.createElement('div');
      line.classList.add('line');
      line.style.left = p1[0] + 'px';
      line.style.top = p1[1] + 'px';
      line.style.width = Math.round(Math.sqrt((p2[1] - p1[1])*(p2[1] - p1[1]) + (p2[0] - p1[0])*(p2[0] - p1[0]))) + 'px';
      line.style.transform = 'rotate(' + angle + 'deg)';
      wall.appendChild(line);
    }

    for (let i = 0; i < this.points.length - 1; i++) {
      drawLine(wall, this.points[i], this.points[i+1]);
    }
  }

  isIntersect = (x, y) => {
    function Vp(x1, y1, x2, y2, x3, y3, x4, y4) {
      return (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    }

    function isIntersectLine(x, y, p1, p2) {
      let ddx = p2[0] - p1[0];
      let ddy = p2[1] - p1[1];
      const ddmul = 10 / Math.sqrt(ddx * ddx + ddy * ddy);
      ddx *= ddmul;
      ddy *= ddmul;
      let dx = p1[1] - p2[1];
      let dy = p2[0] - p1[0];
      const mul = 10 / Math.sqrt(dx*dx + dy*dy);
      dx *= mul;
      dy *= mul;
      const bx = [p1[0] + dx - ddx, p2[0] + dx + ddx, p2[0] - dx + ddx, p1[0] - dx - ddx];
      const by = [p1[1] + dy - ddy, p2[1] + dy + ddy, p2[1] - dy + ddy, p1[1] - dy - ddy];
      bx.push(bx[0]);
      by.push(by[0]);
      let zn = 0;
      for (let i = 0; i < bx.length - 1; i++) {
        let czn;
        const vp = Vp(bx[i], by[i], bx[i+1], by[i+1], bx[i], by[i], x, y);
        if (Math.abs(vp) > 1e-4 && vp > 0) czn = 1; else
        if (Math.abs(vp) > 1e-4 && vp < 0) czn = -1; else czn = 0;
        if (czn === 1 && zn == 0) zn = 1; else
        if (czn === -1 && zn == 0) zn = -1; else
        if (czn * zn === -1) return false;
      }
      return true;
    }
    for (let i = 0; i < this.points.length - 1; i++) {
      if (isIntersectLine(x, y, this.points[i], this.points[i+1])) return true;
    }
    return false;
  }
}

module.exports = Wall;