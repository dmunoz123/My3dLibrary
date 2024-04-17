import { Transformable } from '../Group'

export default class XYGrid extends Transformable {
  constructor(gridSize = 10, step = 1) {
    super()
    this.gridSize = gridSize
    this.step = step
    this.vertices = this.generateGridVertices(gridSize, step)
    this.color = { r: 0.7, g: 0.0, b: 0.0 }
  }

  generateGridVertices(gridSize, step) {
    const vertices = []

    for (let x = -gridSize; x <= gridSize; x += step) {
      vertices.push(x, -gridSize, 0)
      vertices.push(x, gridSize, 0)
    }

    for (let y = -gridSize; y <= gridSize; y += step) {
      vertices.push(-gridSize, y, 0)
      vertices.push(gridSize, y, 0)
    }

    return vertices
  }

  toRawLineArray() {
    return this.vertices
  }

  toRawTriangleArray() {
    return this.vertices
  }
}
