const world = [];
let rotation;
const rotationSpeed = 0.02;
let specialSphere = [0, 0, 0, 0]; // Controllable sphere position

const worldSize = 100;

function randomSphere() {
  return {
    center: Array.from({ length: 4 }, () => random(-worldSize, worldSize)),
    radius: random(10, 20),
    color: [random(100, 255), random(100, 255), random(100, 255)],
  };
}

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  rotation = identityMatrix();
  for (let i = 0; i < 100; i++) {
    world.push(randomSphere());
  }
}

function draw() {
  // Removed orbitControl();
  perspective();
  handleInput();
  background(30);
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);

  // Draw random spheres
  world.forEach(({ center, radius, color }) => {
    const [x, y, z, w] = matVecMult(rotation, center);
    if (Math.abs(w) <= radius) {
      push();
      translate(x, y, z);
      ambientMaterial(...color);
      sphere(Math.sqrt(radius ** 2 - w ** 2));
      pop();
    }
  });

  // Draw special controllable sphere with glow + color shift
  const [sx, sy, sz, sw] = matVecMult(rotation, specialSphere);
  if (Math.abs(sw) <= 30) {
    const pulse = (sin(frameCount * 0.1) + 1) * 0.5;
    const r = lerp(200, 255, pulse);
    const g = lerp(50, 200, pulse);
    const b = lerp(255, 200, pulse);

    push();
    translate(sx, sy, sz);
    ambientMaterial(r, g, b);
    emissiveMaterial(r * 0.3, g * 0.3, b * 0.3);
    sphere(Math.sqrt(30 ** 2 - sw ** 2));
    pop();
  }

  // Draw 4D compass
  draw4DCompass();
}

function handleInput() {
  const keyMap = {
    81: [0, 1],
    87: [0, 2],
    69: [1, 2],
    65: [0, 3],
    83: [1, 3],
    68: [2, 3],
  };
  const angle = () => (keyIsDown(SHIFT) ? -rotationSpeed : rotationSpeed);

  // Rotation
  Object.entries(keyMap).forEach(([code, [i, j]]) => {
    if (keyIsDown(+code)) {
      rotation = matMatMult(rotationMatrix(i, j, angle()), rotation);
    }
  });

  const moveStep = 5;

  // Special sphere movement with intuitive pairing
  if (keyIsDown(85)) specialSphere[0] -= moveStep; // U → X−
  if (keyIsDown(74)) specialSphere[0] += moveStep; // J → X+
  if (keyIsDown(73)) specialSphere[1] += moveStep; // I → Y+
  if (keyIsDown(75)) specialSphere[1] -= moveStep; // K → Y−
  if (keyIsDown(79)) specialSphere[2] -= moveStep; // O → Z−
  if (keyIsDown(76)) specialSphere[2] += moveStep; // L → Z+
  if (keyIsDown(89)) specialSphere[3] -= moveStep; // Y → W−
  if (keyIsDown(72)) specialSphere[3] += moveStep; // H → W+

  // Wrap around [-100, 100]
  for (let i = 0; i < 4; i++) {
    if (specialSphere[i] > 100)
      specialSphere[i] = -100 + (specialSphere[i] - 100);
    if (specialSphere[i] < -100)
      specialSphere[i] = 100 - (-100 - specialSphere[i]);
  }
}

function draw4DCompass() {
  push();
  translate(width / 3, -height / 3, 0);
  strokeWeight(3);

  const ex = matVecMult(rotation, [1, 0, 0, 0]);
  const ey = matVecMult(rotation, [0, 1, 0, 0]);
  const ez = matVecMult(rotation, [0, 0, 1, 0]);
  const ew = matVecMult(rotation, [0, 0, 0, 1]);

  const scale = 50;

  stroke(255, 0, 0);
  line(0, 0, 0, ex[0] * scale, ex[1] * scale, ex[2] * scale);
  stroke(0, 255, 0);
  line(0, 0, 0, ey[0] * scale, ey[1] * scale, ey[2] * scale);
  stroke(0, 0, 255);
  line(0, 0, 0, ez[0] * scale, ez[1] * scale, ez[2] * scale);
  stroke(255, 255, 0);
  line(0, 0, 0, ew[0] * scale, ew[1] * scale, ew[2] * scale);

  pop();
}

const identityMatrix = () =>
  [...Array(4)].map((_, i) => [...Array(4)].map((_, j) => (i === j ? 1 : 0)));

const rotationMatrix = (i, j, angle) => {
  const m = identityMatrix();
  m[i][i] = m[j][j] = Math.cos(angle);
  m[i][j] = -Math.sin(angle);
  m[j][i] = -m[i][j];
  return m;
};

const matVecMult = (mat, vec) =>
  mat.map((row) => row.reduce((sum, v, i) => sum + v * vec[i], 0));

const matMatMult = (a, b) =>
  a.map((row, i) =>
    row.map((_, j) => row.reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0))
  );
