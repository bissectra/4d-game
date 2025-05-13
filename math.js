const matVecMult = (mat, vec) =>
    mat.map((row) => row.reduce((sum, v, i) => sum + v * vec[i], 0));  

const identityMatrix = (n) =>
    [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => (i === j ? 1 : 0)));
  