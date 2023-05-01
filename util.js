// https://wikimedia.org/api/rest_v1/media/math/render/svg/0b15bc10bec3cd9c5b3b5da18a9e5d74f4d3d484
export function matrixCoefficientToYBRMatix (coefficients) {
  const [KR, KG, KB] = coefficients

  const Y = [KR, KG, KB]

  const PB = [-1 / 2 * KR / (1 - KB), -1 / 2 * KG / (1 - KB), 1 / 2]

  const PR = [1 / 2, -1 / 2 * KG / (1 - KR), -1 / 2 * KB / (1 - KR)]

  return [Y, PB, PR]
}

// https://wikimedia.org/api/rest_v1/media/math/render/svg/de5c77f14e7456e9f4f6880057b1c9beeada8b3c
export function matrixCoefficientToRGBMatrix (coefficients) {
  const [KR, KG, KB] = coefficients

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

export function convertColorSpace (from, to) {
  const m1 = matrixCoefficientToYBRMatix(from)
  const m2 = matrixCoefficientToRGBMatrix(to)

  return multiplyMatrices(m2, m1)
}

export function matrixToSVGMatrix (matrix) {
  let out = ''
  for (const row of matrix) {
    for (const number of row) {
      out += (+number.toFixed(8)).toString() + ' '
    }
    out += '0 0 '
  }
  out += '0 0 0 1 0'
  return out
}
