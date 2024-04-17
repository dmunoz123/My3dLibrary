export default class Matrix {
  constructor() {
    this.data = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  reset() {
    for (let i = 0; i < 16; i++) {
      this.data[i] = i % 5 === 0 ? 1 : 0 // Only diagonal elements are 1
    }
  }

  multiply(matrix) {
    const result = new Float32Array(16)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0
        for (let k = 0; k < 4; k++) {
          sum += this.data[row * 4 + k] * matrix.data[k * 4 + col]
        }
        result[row * 4 + col] = sum
      }
    }
    this.data.set(result)
    return this
  }

  translate(tx, ty, tz) {
    for (let i = 0; i < 4; i++) {
      this.data[12 + i] += this.data[i] * tx + this.data[4 + i] * ty + this.data[8 + i] * tz
    }
    return this
  }

  scale(sx, sy, sz) {
    for (let i = 0; i < 4; i++) {
      this.data[i] *= sx
      this.data[4 + i] *= sy
      this.data[8 + i] *= sz
    }
    return this
  }

  rotate(angle, x, y, z) {
    const rad = (Math.PI / 180) * angle
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    const t = 1 - c
    const norm = Math.sqrt(x * x + y * y + z * z)
    x /= norm
    y /= norm
    z /= norm

    const rx = x * x * t + c
    const ry = y * x * t + z * s
    const rz = z * x * t - y * s
    const ux = x * y * t - z * s
    const uy = y * y * t + c
    const uz = z * y * t + x * s
    const vx = x * z * t + y * s
    const vy = y * z * t - x * s
    const vz = z * z * t + c

    const result = new Float32Array(16)
    for (let i = 0; i < 4; i++) {
      result[i] = this.data[i] * rx + this.data[4 + i] * ux + this.data[8 + i] * vx
      result[4 + i] = this.data[i] * ry + this.data[4 + i] * uy + this.data[8 + i] * vy
      result[8 + i] = this.data[i] * rz + this.data[4 + i] * uz + this.data[8 + i] * vz
      result[12 + i] = this.data[12 + i]
    }
    this.data.set(result)
    return this
  }

  orthographic(left, right, bottom, top, near, far) {
    this.reset()
    this.data[0] = 2 / (right - left)
    this.data[5] = 2 / (top - bottom)
    this.data[10] = -2 / (far - near)
    this.data[12] = -(right + left) / (right - left)
    this.data[13] = -(top + bottom) / (top - bottom)
    this.data[14] = -(far + near) / (far - near)
    return this
  }

  perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2)
    this.reset()
    this.data[0] = f / aspect
    this.data[5] = f
    this.data[10] = (far + near) / (near - far)
    this.data[11] = -1
    this.data[14] = (2 * far * near) / (near - far)
    this.data[15] = 0
    return this
  }

  toWebGL() {
    return new Float32Array(this.data)
  }
}
