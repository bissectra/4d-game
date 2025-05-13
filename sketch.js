let world = [];
let rotation;
const rotationSpeed = 0.02;
let player = [0,0,0,0]


function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  rotation = identityMatrix();
  for (let i = 0; i < 100; i++) {
    world.push(randomSphere());
  }
}

function draw() {
  perspective();
  handleInput();
  background(200);
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 1, -1);

  // Draw random spheres and check for collisions with the player
  world = world.filter(({ center, radius, color }) => {
    const distToPlayer = calculateDistance(center, player);

    // Check if the distance is less than the sum of the radii (indicating a collision)
    if (distToPlayer < radius + 30) { // 30 is the radius of the player
      console.log((world.length - 1) + " spheres to go")
      return false; // This sphere is eaten and should be removed
    }

    // Draw the sphere if not eaten (use rotated position for rendering)
    drawSphere(center, radius, color);
    
    return true; // Keep this sphere in the world
  });

  // Draw controllable player with glow + color shift
  drawPlayer();

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

  // player movement with intuitive pairing
  if (keyIsDown(85)) player[0] -= moveStep; // U → X−
  if (keyIsDown(74)) player[0] += moveStep; // J → X+
  if (keyIsDown(73)) player[1] += moveStep; // I → Y+
  if (keyIsDown(75)) player[1] -= moveStep; // K → Y−
  if (keyIsDown(79)) player[2] -= moveStep; // O → Z−
  if (keyIsDown(76)) player[2] += moveStep; // L → Z+
  if (keyIsDown(89)) player[3] -= moveStep; // Y → W−
  if (keyIsDown(72)) player[3] += moveStep; // H → W+

  // Wrap around [-100, 1https://bissectra.github.io/4d-game/00]
  for (let i = 0; i < 4; i++) {
    if (player[i] > 100)
      player[i] = -100 + (player[i] - 100);
    if (player[i] < -100)
      player[i] = 100 - (-100 - player[i]);
  }
}
