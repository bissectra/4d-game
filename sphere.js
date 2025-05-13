function randomSphere() {
  return {
    center: Array.from({ length: 4 }, () => random(-100, 100)),
    radius: random(10, 20),
    color: [random(100, 255), random(100, 255), random(100, 255)],
  };
}

function drawSphere(center, radius, color) {
  const [x, y, z, w] = matVecMult(rotation, center);

  // Ensure the radius under the square root is valid (non-negative)
  const validRadius = Math.sqrt(radius ** 2 - w ** 2);
  if (!isNaN(validRadius) && validRadius >= 0) {
    push();
    translate(x, y, z);
    ambientMaterial(...color);
    sphere(validRadius);
    pop();
  }
}

function drawPlayer() {
  const [sx, sy, sz, sw] = matVecMult(rotation, player);
  if (Math.abs(sw) <= 30) {
    const pulse = (sin(frameCount * 0.1) + 1) * 0.5;
    const r = lerp(200, 255, pulse);
    const g = lerp(50, 200, pulse);
    const b = lerp(255, 200, pulse);

    push();
    translate(sx, sy, sz);
    ambientMaterial(r, g, b);
    emissiveMaterial(r * 0.3, g * 0.3, b * 0.3);
    sphere(Math.sqrt(30 ** 2 - sw ** 2));  // Ensure valid radius
    pop();
  }
}
