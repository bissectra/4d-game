let world = [];
let model;
let shootSound;
let score = 0; // Initialize the score

function preload() {
  shootSound = loadSound('shoot.mp3'); // Load the sound file
}

function setup() {
  const canvasContainer = document.body; // Use the body to calculate available space
  const canvasWidth = canvasContainer.clientWidth;
  const canvasHeight = canvasContainer.clientHeight - document.querySelector('main').offsetHeight;

  createCanvas(canvasWidth, canvasHeight, WEBGL);
  noStroke();
  model = identityMatrix(5);
  generateWorld(100);

  // Initialize the score display
  updateScore();
}

function draw() {
  background(220);
  handleInput();
  setupLighting();
  drawWorld();
  drawTarget();
}

function windowResized() {
  const canvasContainer = document.body; // Use the body to calculate available space
  const canvasWidth = canvasContainer.clientWidth;
  const canvasHeight = canvasContainer.clientHeight - document.querySelector('main').offsetHeight;

  resizeCanvas(canvasWidth, canvasHeight);
}

function keyPressed() {
  if (key === ' ') shoot();
}

// World Management
function generateWorld(count) {
  for (let i = 0; i < count; i++) {
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

// Drawing Functions
function drawWorld() {
  world.forEach(({ center, radius, color }) => {
    drawSphere(center, radius, color);
  });
}

function drawSphere(center, radius, color, transform = true) {
  const [x, y, z, w] = transform ? matVecMult(model, [...center, 1]) : center;
  const validRadius = Math.sqrt(radius ** 2 - w ** 2);

  if (!isNaN(validRadius) && validRadius >= 0) {
    push();
    translate(x, y, z);
    ambientMaterial(...color);
    sphere(validRadius);
    pop();
  }
}

function drawTarget() {
  push();
  drawingContext.disable(drawingContext.DEPTH_TEST); // Disable depth test
  translate(0, 0, 0);
  strokeWeight(2);
  stroke(255, 0, 0); // Red color
  noFill();
  line(-20, 0, 0, 20, 0, 0); // Horizontal line
  line(0, -20, 0, 0, 20, 0); // Vertical line
  drawingContext.enable(drawingContext.DEPTH_TEST); // Re-enable depth test
  pop();
}

// Input Handling
function handleInput() {
  const step = 5;
  const rotationSpeed = 0.02;

  const keyMappings = [
    { keys: ['Y', 'H', 'U', 'J', 'I', 'K', 'O', 'L'], action: handleTranslation },
    { keys: ['Q', 'W', 'E', 'A', 'S', 'D'], action: handleRotation },
  ];

  keyMappings.forEach(({ keys, action }) => {
    keys.forEach((key) => {
      if (keyIsDown(key.charCodeAt(0))) {
        action(key, step, rotationSpeed);
      }
    });
  });
}

function handleTranslation(key, step) {
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

  const transform = translationMatrix(...keyMap[key]);
  model = matMatMult(transform, model);
}

function handleRotation(key, _, rotationSpeed) {
  const angle = keyIsDown(SHIFT) ? -rotationSpeed : rotationSpeed;

  const keyMap = {
    Q: [0, 1],
    W: [0, 2],
    E: [1, 2],
    A: [0, 3],
    S: [1, 3],
    D: [2, 3],
  };

  const transform = rotationAboutPoint([0, 0, 0, 0], ...keyMap[key], angle);
  model = matMatMult(transform, model);
}

// Shooting Logic
function shoot() {
  shootSound.play();
  let hitCount = 0; // Track how many spheres are hit

  world = world.filter(({ center, radius }) => {
    const [x, y, z, w] = matVecMult(model, [...center, 1]);
    const d = Math.sqrt(radius ** 2 - w ** 2);
    const isVisible = !isNaN(d) && d >= 0;

    if (!isVisible) return true;

    const distance = Math.sqrt(x ** 2 + y ** 2);
    const isHit = distance <= radius;

    if (isHit) {
      hitCount++; // Increment hit count
      return false; // Remove the sphere
    }

    return true; // Keep the sphere
  });

  // Update the score if any spheres were hit
  if (hitCount > 0) {
    score += hitCount; // Increment score by the number of spheres hit
    updateScore(); // Update the score display
  }
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = score; // Update the score in the HTML
  }
}

// Lighting Setup
function setupLighting() {
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);
}