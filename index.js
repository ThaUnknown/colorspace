import { matrixCoefficients, levels, svgStart, svgEnd } from './constants.js'
import { convertColorSpace, levelsOffset, matrixToSVGMatrix } from './util.js'

// node index.js: column-major 3x3 matrices, as GLSL mat3, then the R, G, B offsets. node index.js svg: SVG filters.
const svg = process.argv[2] === 'svg'

const fromArr = Object.keys(matrixCoefficients)

const toArr = ['BT.709', 'BT.601', 'BT.2020']

const map = {}

for (const from of fromArr) {
  for (const fromLevels of Object.keys(levels)) {
    map[`${from} ${fromLevels}`] = {}
    for (const to of toArr) {
      for (const toLevels of Object.keys(levels)) {
        if (from === to && fromLevels === toLevels) continue
        const matrix = convertColorSpace(matrixCoefficients[from], matrixCoefficients[to], levels[fromLevels], levels[toLevels])
        const offset = levelsOffset(levels[fromLevels], levels[toLevels])
        map[`${from} ${fromLevels}`][`${to} ${toLevels}`] = svg
          ? svgStart + matrixToSVGMatrix(matrix, offset) + svgEnd
          : [0, 1, 2].flatMap(column => matrix.map(row => row[column])).concat([offset, offset, offset]).map(number => +number.toFixed(6) + 0)
      }
    }
  }
}

console.log(svg ? map : JSON.stringify(map, null, 2).replace(/\[\s+([^\]]*?)\s+\]/g, (_, numbers) => `[${numbers.split(/,\s+/).join(', ')}]`))
