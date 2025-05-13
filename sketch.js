let world = [];
let player = [0,0,0,0];
let model;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  model = identityMatrix(5);
  for (let i = 0; i < 100; i++) {
    world.push(randomSphere());
  }
}

function draw() {
  background(220);
  
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);
  
  world.forEach(({center, radius, color}) => {
    drawSphere(center, radius, color);
  })
}

function randomSphere() {
  return {
    center: Array.from({ length: 4 }, () => random(-100, 100)),
    radius: random(10, 20),
    color: [random(100, 255), random(100, 255), random(100, 255)],
  };
}

const identityMatrix = (n) =>
  [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => (i === j ? 1 : 0)));

function drawSphere(center, radius, color) {
  const [x, y, z, w] = matVecMult(model, [...center, 1]);

  const validRadius = Math.sqrt(radius ** 2 - w ** 2);
  if (!isNaN(validRadius) && validRadius >= 0) {
    push();
    translate(x, y, z);
    ambientMaterial(...color);
    sphere(validRadius);
    pop();
  }
}

const matVecMult = (mat, vec) =>
  mat.map((row) => row.reduce((sum, v, i) => sum + v * vec[i], 0));

