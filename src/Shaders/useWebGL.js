import { useEffect } from 'react'
import { getGL, initVertexBuffer, initIndexBuffer, initSimpleShaderProgram } from '../glsl-utils'

export const useWebGL = (canvasRef, settings, objectsToDraw) => {
  const { useWireframe } = settings
  useEffect(() => {
    const canvas = canvasRef.current
    const gl = getGL(canvas)
    if (!gl) {
      alert('Sorry, your browser does not support WebGL')
      return
    }

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    const shaderProgram = initSimpleShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
    if (!shaderProgram) {
      alert('Shader initialization failed.')
      return
    }

    gl.useProgram(shaderProgram)

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'vertexPosition')
    gl.enableVertexAttribArray(vertexPosition)

    const colorUniform = gl.getUniformLocation(shaderProgram, 'color')
    const uMatrixLocation = gl.getUniformLocation(shaderProgram, 'uMatrix')

    objectsToDraw.forEach(obj => {
      obj.verticesBuffer = initVertexBuffer(gl, obj.vertices)
      obj.colorsBuffer = initVertexBuffer(gl, obj.colors)
      if (obj.indices) {
        obj.indexBuffer = initIndexBuffer(gl, obj.indices)
      }
    })

    const drawScene = () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      objectsToDraw.forEach(obj => {
        // Convert the color object to an array
        const colorArray = [obj.color.r, obj.color.g, obj.color.b]

        gl.uniform3fv(colorUniform, colorArray) // Pass the array to the shader
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.verticesBuffer)
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.uniformMatrix4fv(uMatrixLocation, false, obj.matrix.toWebGL())
        if (settings.useWireframe || !obj.indexBuffer) {
          gl.drawArrays(obj.mode, 0, obj.vertices.length / 3)
        } else {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer)
          gl.drawElements(obj.mode, obj.indices.length, gl.UNSIGNED_SHORT, 0)
        }
      })
    }

    const renderLoop = () => {
      drawScene()
      requestAnimationFrame(renderLoop)
    }

    renderLoop()
    return () => cancelAnimationFrame(renderLoop)
  }, [useWireframe, objectsToDraw])
}

const VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;
uniform mat4 uMatrix;

void main(void) {
    gl_Position = uMatrix * vec4(vertexPosition, 1.0);
}
`

const FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 color;

void main(void) {
    gl_FragColor = vec4(color, 1.0);
}
`
