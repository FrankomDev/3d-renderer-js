import { points, lines } from "./model.js";

const xyz = [
  document.getElementById("x"),
  document.getElementById("y"),
  document.getElementById("z"),
]

let offset = {
  x: 0,
  y: 0,
  z: 0
};

for (let i of xyz) {
  i.addEventListener("input", function() {
    let p = document.getElementById(`${i.id}-p`);
    p.textContent = `${i.id.toUpperCase()}: ${i.value}`;
    offset[i.id] = Number(i.value);
  });
}


const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

context.fillStyle = "black";

/*
X2D = X3D / Z3D
Y2D = Y3D / Z3D
*/

function rotate(x, y, z, angle) {
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);

  return {
    x: x * cos + z * sin,
    y: y,
    z: -(x * sin) + z * cos
  };
}

function math_to_normal_cords(x, y) {
  return {
    x: (1+x) * canvas.width/2,
    y: (1-y) * canvas.height/2
  };
}

function p3d_to_p2d(x, y, z) {
  return math_to_normal_cords(x / z, y / z);
}

function draw_p3d(x, y, z) {
  let point = p3d_to_p2d(x, y, z);
  context.fillRect(point.x, point.y, 10, 10);
}

/* CUBE:
let points = [
  {x: 0.2, y: 0.2, z: 0.2},
  {x: -0.2, y: 0.2, z: 0.2},

  {x: 0.2, y: -0.2, z: 0.2},
  {x: -0.2, y: -0.2, z: 0.2},

  {x: 0.2, y: 0.2, z: -0.2},
  {x: -0.2, y: 0.2, z: -0.2},

  {x: 0.2, y: -0.2, z: -0.2},
  {x: -0.2, y: -0.2, z: -0.2},
]
let lines = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 1],
  [4, 6],
  [2, 6],
  [5, 7],
  [6, 7],
  [3, 7],
]*/

let angle = 0;
function loop() {
  context.clearRect(0, 0, 1000, 1000);

  /* Drawing vertices
  for (let p of points) {
    let rotated = rotate(p.x, p.y, p.z, angle)
    //draw_p3d(p.x, p.y, p.z + dz);
    draw_p3d(rotated.x + offset.x, rotated.y + offset.y, rotated.z + offset.z);
  }
  */

  for (let face of lines) {
    let points2d = [];
    for (let index of face) {
      let point = points[index-1];
      let rotated = rotate(point.x, point.y, point.z, angle);
      points2d.push(p3d_to_p2d(rotated.x+offset.x, rotated.y+offset.y, rotated.z+offset.z));
    }

    context.beginPath();
    context.moveTo(points2d[0].x, points2d[0].y);
    for (let i = 1; i < points2d.length; i++) {
      context.lineTo(points2d[i].x, points2d[i].y);
    }
    context.stroke();
  }

  angle+=0.2;
  setTimeout(loop, 100);
}
loop();
