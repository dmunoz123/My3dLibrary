import { Transformable } from "../Group"

export default class Sphere extends Transformable {
  constructor(radius = 1, widthSegments = 9, heightSegments = 6) {
    super()
    this.radius = radius
    this.widthSegments = widthSegments
    this.heightSegments = heightSegments
    this.vertices = []
    this.indices = []
    this.generateSphere()
    this.color = { r: 0.7, g: 0.0, b: 0.0 }
  }

  generateSphere() {
    const phiStart = 0
    const phiLength = Math.PI * 2
    const thetaStart = 0
    const thetaLength = Math.PI

    for (let y = 0; y <= this.heightSegments; y++) {
      const verticesRow = []
      const v = y / this.heightSegments

      for (let x = 0; x <= this.widthSegments; x++) {
        const u = x / this.widthSegments

        const xpos = this.radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
        const ypos = this.radius * Math.cos(thetaStart + v * thetaLength)
        const zpos = this.radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)

        this.vertices.push(xpos, ypos, zpos)
        verticesRow.push(this.vertices.length / 3 - 1)
      }

      if (y > 0) {
        for (let x = 0; x < this.widthSegments; x++) {
          const a = verticesRow[x]
          const b = verticesRow[x + 1]
          const c = verticesRow[x + 1] - (this.widthSegments + 1)
          const d = verticesRow[x] - (this.widthSegments + 1)

          this.indices.push(a, d, b)
          this.indices.push(b, d, c)
        }
      }
    }
  }

  toRawTriangleArray() {
    const result = []
    for (let i = 0; i < this.indices.length; i += 3) {
      for (let j = 0; j < 3; j++) {
        const idx = this.indices[i + j] * 3
        result.push(this.vertices[idx], this.vertices[idx + 1], this.vertices[idx + 2])
      }
    }
    return result
  }

  toRawLineArray() {
    const result = []
    for (let i = 0; i < this.indices.length; i += 3) {
      for (let j = 0; j < 3; j++) {
        const idx1 = this.indices[i + j] * 3
        const idx2 = this.indices[i + ((j + 1) % 3)] * 3
        // Add line segment between vertices[idx1] and vertices[idx2]
        result.push(
          this.vertices[idx1],
          this.vertices[idx1 + 1],
          this.vertices[idx1 + 2],
          this.vertices[idx2],
          this.vertices[idx2 + 1],
          this.vertices[idx2 + 2]
        )
      }
    }
    return result
  }
}
