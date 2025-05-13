
function calculateDistance(center1, center2) {
  // Calculate the distance between two 4D points
  const [x1, y1, z1, w1] = center1;
  const [x2, y2, z2, w2] = center2;

  return Math.sqrt(
    (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2 + (w2 - w1) ** 2
  );
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
