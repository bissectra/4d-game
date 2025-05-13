let world = [];
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

function player() {
  const [x, y, z, w, t] = model.map((row) => row[4]);
  return [-x / t, -y / t, -z / t, -w / t];
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

  handleInput();

  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);

  world.forEach(({ center, radius, color }) => {
    drawSphere(center, radius, color);
  });

  drawTarget();
}

function drawSphere(center, radius, color, transform=true) {
  const [x, y, z, w] = transform ? matVecMult(model, [...center, 1]): center;

  const validRadius = Math.sqrt(radius ** 2 - w ** 2);
  if (!isNaN(validRadius) && validRadius >= 0) {
    push();
    translate(x, y, z);
    ambientMaterial(...color);
    sphere(validRadius);
    pop();
  }
}

function handleInput() {
  handleRotation();
  handleTranslation();
}

function handleTranslation() {
  const step = 5;
  const keyMap = {
    Y: [step, 0, 0, 0],
    H: [-step, 0, 0, 0],
    U: [0, step, 0, 0],
    J: [0, -step, 0, 0],
    I: [0, 0, step, 0],
    K: [0, 0, -step, 0],
    O: [0, 0, 0, step],
    L: [0, 0, 0, -step],
  };

  Object.entries(keyMap).forEach(([key, value]) => {
    if (keyIsDown(key.charCodeAt(0))) {
      transform = translationMatrix(...value);
      model = matMatMult(transform, model);
    }
  });
}

function handleRotation() {
  const rotationSpeed = 0.02;
  const angle = () => (keyIsDown(SHIFT) ? -rotationSpeed : rotationSpeed);

  const keyMap = {
    Q: [0, 1],
    W: [0, 2],
    E: [1, 2],
    A: [0, 3],
    S: [1, 3],
    D: [2, 3],
  };

  Object.entries(keyMap).forEach(([key, value]) => {
    if (keyIsDown(key.charCodeAt(0))) {
      transform = rotationAboutPoint([0,0,0,0], ...value, angle());
      model = matMatMult(transform, model);
    }
  });
}

function drawTarget() {
  push();

  // Disable depth test to draw on top
  drawingContext.disable(drawingContext.DEPTH_TEST);

  translate(0, 0, 0);

  strokeWeight(2);
  stroke(255, 0, 0);  // Red color
  noFill();

  line(-playerRadius, 0, 0, playerRadius, 0, 0);  // Horizontal line
  line(0, -playerRadius, 0, 0, playerRadius, 0);  // Vertical line

  // Re-enable depth test for future objects
  drawingContext.enable(drawingContext.DEPTH_TEST);

  pop();
}

