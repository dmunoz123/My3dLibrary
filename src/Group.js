import Matrix from './Matrix/Matrix'

// provides similar user interface as threejs to not make user manipulate matrix directly for each transformation, instead they .rotate!
class Transformable {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 }
    this.rotation = { x: 0, y: 0, z: 0 }
    this.scale = { x: 1, y: 1, z: 1 }
    this.matrix = new Matrix()
    this.needsUpdate = false
  }

  updateMatrixLazy() {
    if (!this.needsUpdate) {
      return
    }
    this.matrix.reset()
    this.matrix
      .translate(this.position.x, this.position.y, this.position.z)
      .rotate(this.rotation.x, 1, 0, 0)
      .rotate(this.rotation.y, 0, 1, 0)
      .rotate(this.rotation.z, 0, 0, 1)
      .scale(this.scale.x, this.scale.y, this.scale.z)
    console.log('Updated matrix:', this.matrix.data)
    this.needsUpdate = false
  }

  setPosition(x, y, z) {
    this.position = { x, y, z }
    this.needsUpdate = true
  }

  setRotation(x, y, z) {
    this.rotation = { x, y, z }
    this.needsUpdate = true
  }

  setScale(x, y, z) {
    this.scale = { x, y, z }
    this.needsUpdate = true
  }

  setMatrix(matrix) {
    this.matrix = matrix
    this.needsUpdate = false
  }
}

class Group extends Transformable {
  constructor() {
    super()
    this.children = []
  }

  add(child) {
    if (this.children.includes(child)) {
      console.warn('Child already added')
      return
    }
    this.children.push(child)
  }

  remove(child) {
    const index = this.children.indexOf(child)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
  }

  traverse(callback, parentMatrix = new Matrix(), depth = 0) {
    console.log('Traversing', this, 'at depth', depth) // Debug log
    this.updateMatrixLazy()
    const worldMatrix = parentMatrix.multiply(this.matrix)

    callback(this, worldMatrix)

    this.children.forEach(child => {
      if (child instanceof Group) {
        child.traverse(callback, worldMatrix, depth + 1)
      } else {
        callback(child, worldMatrix)
      }
    })
  }
}

export { Transformable, Group }
