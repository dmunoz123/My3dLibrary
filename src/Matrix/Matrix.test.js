import Matrix from './Matrix'

describe('Matrix implementation', () => {
  test('Initialize identity matrix', () => {
    const m = new Matrix()
    expect(m.data).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })

  test('Resets the matrix', () => {
    const m = new Matrix()
    m.data = Array.from({ length: 16 }, () => Math.random())
    m.reset()
    expect(m.data).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })

  test('Perform matrix multiplication', () => {
    const m1 = new Matrix()
    const m2 = new Matrix()

    m1.data = [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    m2.data = [1, 2, 3, 4, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1]

    const expectedResult = [2, 4, 6, 8, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1]

    const mulMatrix = m1.multiply(m2)

    expect(mulMatrix.data).toEqual(expectedResult)
  })

  test('Creates a translation matrix', () => {
    const tx = 3,
      ty = 4,
      tz = 5
    const tm = Matrix.translation(tx, ty, tz)

    expect(tm.data[12]).toBe(tx)
    expect(tm.data[13]).toBe(ty)
    expect(tm.data[14]).toBe(tz)

    // make sure other 1's stayed the same
    expect(tm.data[0]).toBe(1)
    expect(tm.data[5]).toBe(1)
    expect(tm.data[10]).toBe(1)
    expect(tm.data[15]).toBe(1)

    for (let i = 0; i < tm.data.length; i++) {
      if (![0, 5, 10, 15, 12, 13, 14].includes(i)) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(tm.data[i]).toBe(0)
      }
    }
  })

  test('Creates a scale matrix', () => {
    const sx = 2, sy = 3, sz = 4
    const sm = Matrix.scale(sx, sy, sz)

    expect(sm.data[0]).toBe(sx)
    expect(sm.data[5]).toBe(sy)
    expect(sm.data[10]).toBe(sz)

    for (let i = 0; i < sm.data.length; i++) {
      if (![0, 5, 10, 15].includes(i)) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(sm.data[i]).toBe(0)
      }
    }
  })

  test('Creates a rotation matrix', () => {
    // testing to see if we preserve vector magnitude 
  })

  test('Creates an ortographic matrix', () => {
    // test
  })

  test('Creates a projection matrix', () => {
    // test
  })

  test('Creates a float32Array from matrix', () => {
    const m = new Matrix()
    const webGLFormat = m.toWebGL()
    expect(webGLFormat).toBeInstanceOf(Float32Array)
    expect(webGLFormat).toEqual(new Float32Array(m.data))
  })
})
