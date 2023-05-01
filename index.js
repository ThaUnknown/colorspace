import { matrixCoefficients, svgStart, svgEnd } from './constants.js'
import { convertColorSpace, matrixToSVGMatrix } from './util.js'

const fromArr = Object.keys(matrixCoefficients)

const toArr = ['BT.709', 'BT.601']

const map = {}

for (const from of fromArr) {
  map[from] = {}
  for (const to of toArr) {
    map[from][to] = svgStart + matrixToSVGMatrix(convertColorSpace(matrixCoefficients[from], matrixCoefficients[to])) + svgEnd
  }
}

console.log(map)
