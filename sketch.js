let world = [];
let player = [0,0,0,0];
let playerRadius = 20;
let model;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  model = identityMatrix(5);
  for (let i = 0; i < 100; i++) {
    world.push(randomSphere());
  }
}

function randomSphere() {
  return {
    center: Array.from({ length: 4 }, () => random(-100, 100)),
    radius: 10,
    color: [random(0, 200), random(0, 200), random(100, 255)],
  };
}

function draw() {
  background(220);
  
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);
  
  world.forEach(({center, radius, color}) => {
    drawSphere(center, radius, color);
  })

  drawSphere(player, playerRadius, [255,255,0])
}

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