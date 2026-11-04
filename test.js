import assert from 'node:assert/strict'
import { test } from 'node:test'

import { levels, matrixCoefficients } from './constants.js'
import { convertColorSpace, levelsOffset, matrixCoefficientToYBRMatix, multiplyMatrices } from './util.js'

const COLORS = [[0, 0, 0], [1, 1, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [0.2, 0.6, 0.9]]
const MATRICES = Object.keys(matrixCoefficients)
const LEVELS = Object.keys(levels)

const apply = (matrix, offset, color) => multiplyMatrices(matrix, color.map(value => [value])).map(([value]) => value + offset)
const close = (actual, expected, label) => actual.forEach((value, i) => assert.ok(Math.abs(value - expected[i]) < 1e-9, `${label}: ${actual} != ${expected}`))

test('a conversion to the same color space does not change colors', () => {
  for (const name of MATRICES) {
    for (const level of LEVELS) {
      const matrix = convertColorSpace(matrixCoefficients[name], matrixCoefficients[name], levels[level], levels[level])
      for (const color of COLORS) close(apply(matrix, levelsOffset(levels[level], levels[level]), color), color, `${name} ${level}`)
    }
  }
})

test('with the same levels, the luma does not change', () => {
  const luma = (name, color) => multiplyMatrices(matrixCoefficientToYBRMatix(matrixCoefficients[name]), color.map(value => [value]))[0][0]
  for (const from of MATRICES) {
    for (const to of MATRICES) {
      for (const level of LEVELS) {
        assert.equal(levelsOffset(levels[level], levels[level]), 0)
        const matrix = convertColorSpace(matrixCoefficients[from], matrixCoefficients[to], levels[level], levels[level])
        for (const color of COLORS) assert.ok(Math.abs(luma(to, apply(matrix, 0, color)) - luma(from, color)) < 1e-9, `${from} to ${to}`)
      }
    }
  }
})

test('TV levels read as PC levels lift black and lower white', () => {
  const matrix = convertColorSpace(matrixCoefficients['BT.601'], matrixCoefficients['BT.601'], levels.TV, levels.PC)
  const offset = levelsOffset(levels.TV, levels.PC)
  close(apply(matrix, offset, [0, 0, 0]), [16 / 255, 16 / 255, 16 / 255], 'black')
  close(apply(matrix, offset, [1, 1, 1]), [235 / 255, 235 / 255, 235 / 255], 'white')
})

test('PC levels read as TV levels undo TV levels read as PC levels', () => {
  for (const name of MATRICES) {
    const there = convertColorSpace(matrixCoefficients[name], matrixCoefficients[name], levels.TV, levels.PC)
    const back = convertColorSpace(matrixCoefficients[name], matrixCoefficients[name], levels.PC, levels.TV)
    for (const color of COLORS) close(apply(back, levelsOffset(levels.PC, levels.TV), apply(there, levelsOffset(levels.TV, levels.PC), color)), color, name)
  }
})

test('with the same levels, a conversion is the conversion without levels', () => {
  for (const from of MATRICES) {
    for (const to of MATRICES) {
      const withoutLevels = convertColorSpace(matrixCoefficients[from], matrixCoefficients[to]).flat()
      for (const level of LEVELS) close(convertColorSpace(matrixCoefficients[from], matrixCoefficients[to], levels[level], levels[level]).flat(), withoutLevels, `${from} to ${to} ${level}`)
    }
  }
})
