import { Transformable } from '../Group'

export default class Cube extends Transformable {
  constructor(size = 1) {
    super()
    this.size = size // user can manipulate size of cube on init
    this.vertices = this.generateVertices(size)
    this.facesByIndex = this.defineFacesByIndex()
    this.color = { r: 0.7, g: 0.0, b: 0.0 }
  }

  generateVertices(size) {
    return [
      [-0.5, -0.5, -0.5], // 0
      [0.5, -0.5, -0.5], // 1
      [0.5, 0.5, -0.5], // 2
      [-0.5, 0.5, -0.5], // 3
      [-0.5, -0.5, 0.5], // 4
      [0.5, -0.5, 0.5], // 5
      [0.5, 0.5, 0.5], // 6
      [-0.5, 0.5, 0.5] // 7
    ].map(vertex => vertex.map(coordinate => coordinate * size))
  }

  defineFacesByIndex() {
    return [
      [0, 3, 2],
      [0, 2, 1], // back
      [1, 2, 6],
      [1, 6, 5], // right
      [4, 6, 7],
      [4, 5, 6], // front
      [0, 7, 3],
      [0, 4, 7], // left
      [4, 1, 5],
      [4, 0, 1], // bottom
      [3, 7, 6],
      [3, 6, 2] // top
    ]
  }

  toRawTriangleArray() {
    const result = []
    this.facesByIndex.forEach(face => {
      face.forEach(vertexIndex => {
        result.push(...this.vertices[vertexIndex])
      })
    })
    return result
  }

  toRawLineArray() {
    const result = []
    this.facesByIndex.forEach(face => {
      for (let i = 0, maxI = face.length; i < maxI; i++) {
        result.push(...this.vertices[face[i]], ...this.vertices[face[(i + 1) % maxI]])
      }
    })
    return result
  }
}
