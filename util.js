// https://wikimedia.org/api/rest_v1/media/math/render/svg/0b15bc10bec3cd9c5b3b5da18a9e5d74f4d3d484
export function matrixCoefficientToYBRMatix (coefficients) {
  const [KR, KB] = coefficients
  const KG = 1 - KR - KB

  const Y = [KR, KG, KB]

  const PB = [-1 / 2 * KR / (1 - KB), -1 / 2 * KG / (1 - KB), 1 / 2]

  const PR = [1 / 2, -1 / 2 * KG / (1 - KR), -1 / 2 * KB / (1 - KR)]

  return [Y, PB, PR]
}

// https://wikimedia.org/api/rest_v1/media/math/render/svg/de5c77f14e7456e9f4f6880057b1c9beeada8b3c
export function matrixCoefficientToRGBMatrix (coefficients) {
  const [KR, KB] = coefficients
  const KG = 1 - KR - KB

  const R = [1, 0, 2 - 2 * KR]

  const G = [1, -(KB / KG) * (2 - 2 * KB), -(KR / KG) * (2 - 2 * KR)]

  const B = [1, 2 - 2 * KB, 0]

  return [R, G, B]
}

export function multiplyMatrices (m1, m2) {
  const result = []
  for (let i = 0; i < m1.length; i++) {
    result[i] = []
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

// YPbPr written with fromLevels, then read with toLevels
function levelsToMatrix (fromLevels, toLevels) {
  const Y = fromLevels[1] / toLevels[1]
  const C = fromLevels[2] / toLevels[2]

  return [[Y, 0, 0], [0, C, 0], [0, 0, C]]
}

export function convertColorSpace (from, to, fromLevels = [0, 1, 1], toLevels = fromLevels) {
  const m1 = matrixCoefficientToYBRMatix(from)
  const m2 = matrixCoefficientToRGBMatrix(to)

  return multiplyMatrices(m2, multiplyMatrices(levelsToMatrix(fromLevels, toLevels), m1))
}

// The same for R, G and B, because Y is the first column of every RGB matrix
export function levelsOffset (fromLevels, toLevels) {
  return (fromLevels[0] - toLevels[0]) / toLevels[1]
}

export function matrixToSVGMatrix (matrix, offset = 0) {
  let out = ''
  for (const row of matrix) {
    for (const number of row) {
      out += (+number.toFixed(4)).toString() + ' '
    }
    out += '0 ' + (+offset.toFixed(4)).toString() + ' '
  }
  out += '0 0 0 1 0'
  return out
}
