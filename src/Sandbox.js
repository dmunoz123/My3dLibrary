/**
 * Build out this component to display a “sandbox” scene—see the description below.
 */
import { useEffect, useRef, useCallback, useState } from 'react'
import { getGL, initVertexBuffer, initIndexBuffer, initSimpleShaderProgram } from './glsl-utils'
import XYGrid from './Geometries/XY-Grid'
import Cube from './Geometries/Cube'
import Sphere from './Geometries/Sphere'
import { Group } from './Group'
import Matrix from './Matrix/Matrix'

const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;
  uniform mat4 uMatrix;

  void main(void) {
    gl_Position =  uMatrix * vec4(vertexPosition, 1.0);
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

const CANVAS_WIDTH = 512
const CANVAS_HEIGHT = 512

const FRAMES_PER_SECOND = 60
const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

const Sandbox = props => {
  const [useWireframe, setUseWireframe] = useState(false)
  const [showCube, setShowCube] = useState(false)
  const [showXYGrid, setShowXYGrid] = useState(true)
  const [showSphere, setShowSphere] = useState(false)

  // state hooks for transformations
  const [scale, setNewScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [translateZ, setTranslateZ] = useState(0)

  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [rotateZ, setRotateZ] = useState(0)

  const [groups, setGroups] = useState([])
  const [lastObject, setLastObject] = useState(null)

  const canvasRef = useRef()
  const timestampRef = useRef()
  const drawSceneRef = useRef(null)

  const applyTransformation = useCallback(() => {
    if (!lastObject) return

    lastObject.setPosition(translateX, translateY, translateZ)
    lastObject.setRotation(rotateX, rotateY, rotateZ)
    lastObject.setScale(scale, scale, scale)
    lastObject.needsUpdate = true
    lastObject.updateMatrixLazy()
    console.log('Transformations applied:', { scale, rotateX, rotateY, rotateZ, translateX, translateY, translateZ })
    drawSceneRef.current()
    console.log('Last object at transformation:', lastObject)
  }, [scale, rotateX, rotateY, rotateZ, translateX, translateY, translateZ, lastObject])

  useEffect(() => {
    console.log('Effect hook running')
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const gl = getGL(canvas)

    if (!gl) {
      alert('Sorry, Your browser does not support WebGL')
    }

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    // Shader initialization
    let abort = false
    const simpleShaderProgram = initSimpleShaderProgram(
      gl,
      VERTEX_SHADER,
      FRAGMENT_SHADER,

      shader => {
        abort = true
        alert('Shader loading error' + gl.getShaderInfoLog(shader))
      },

      simpleShaderProgram => {
        abort = true
        alert('Could not correctly link the shader program')
      }
    )

    if (abort) {
      alert('Fatal errors encountered; we cannot continue.')
      return
    }

    gl.useProgram(simpleShaderProgram)

    const objectsToDraw = []

    // Conditionally add the XY grid
    if (showXYGrid) {
      const xy = new XYGrid()
      objectsToDraw.push({
        object: xy,
        color: { r: 0.7, g: 0.7, b: 0.7 },
        vertices: xy.toRawLineArray(),
        mode: gl.LINES
      })
    }

    // Conditionally add the cube (only do # in [1.0 -> 1.8])
    if (showCube) {
      const cubeObject = new Cube(1)
      setLastObject(cubeObject)
      objectsToDraw.push({
        object: cubeObject,
        color: { r: 0.7, g: 0.0, b: 0.0 },
        vertices: useWireframe ? cubeObject.toRawLineArray() : cubeObject.toRawTriangleArray(),
        mode: useWireframe ? gl.LINES : gl.TRIANGLES
      })
      setLastObject(cubeObject)
    }

    if (showSphere) {
      const sphereObject = new Sphere()
      objectsToDraw.push({
        object: sphereObject,
        color: { r: 0, g: 0.5, b: 1 }, // Example color for the sphere
        vertices: useWireframe ? sphereObject.toRawLineArray() : sphereObject.toRawTriangleArray(),
        mode: useWireframe ? gl.LINES : gl.TRIANGLES
      })
      setLastObject(sphereObject)
    }

    const vertexPositonAttribute = gl.getAttribLocation(simpleShaderProgram, 'vertexPosition')
    gl.enableVertexAttribArray(vertexPositonAttribute)
    const colorUniform = gl.getUniformLocation(simpleShaderProgram, 'color')
    const uMatrixLocation = gl.getUniformLocation(simpleShaderProgram, 'uMatrix')

    // Load buffers with vertex data
    objectsToDraw.forEach(objectToDraw => {
      // going to implement using classes instead of so many references
      // const transformable = objectToDraw.object

      objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)

      if (!objectToDraw.colors) {
        // If we have a single color, we expand that into an array
        // of the same color over and over.
        objectToDraw.colors = []
        for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
          objectToDraw.colors = objectToDraw.colors.concat(
            objectToDraw.color.r,
            objectToDraw.color.g,
            objectToDraw.color.b
          )
        }

        objectToDraw.colorsBuffer = initVertexBuffer(gl, objectToDraw.colors)
      }

      // if indices exist ...
      if (objectToDraw.indices) {
        objectToDraw.indexBuffer = initIndexBuffer(gl, objectToDraw.indices)
      }
    })

    // drawing obj by vertices
    const drawMyObject = object => {
      gl.uniform3f(colorUniform, object.color.r, object.color.g, object.color.b)

      console.log(object.object.matrix.toWebGL)
      gl.uniformMatrix4fv(uMatrixLocation, false, object.object.matrix.toWebGL())
      gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
      gl.vertexAttribPointer(vertexPositonAttribute, 3, gl.FLOAT, false, 0, 0)

      if (useWireframe || !object.indexBuffer) {
        gl.drawArrays(object.mode, 0, object.vertices.length / 3)
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer)
        gl.drawElements(object.mode, object.indices.length, gl.UNSIGNED_SHORT, 0)
      }
    }

    drawSceneRef.current = () => {
      // Clear the display.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      const drawObjectOrGroup = (item, matrix = new Matrix()) => {
        if (item instanceof Group) {
          item.traverse(drawObjectOrGroup) // Recursively draw children
        } else {
          drawMyObject(item)
        }
      }

      objectsToDraw.forEach(drawObjectOrGroup)

      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    let previousTimestamp
    const nextFrame = timestamp => {
      // Initialize the timestamp.
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(nextFrame)
        return
      }

      // Check if it’s time to advance.
      const progress = timestamp - previousTimestamp
      if (progress < MILLISECONDS_PER_FRAME) {
        // Do nothing if it’s too soon.
        window.requestAnimationFrame(nextFrame)
        return
      }

      drawSceneRef.current()

      if (timestampRef.current) {
        timestampRef.current.innerText = `Timestamp: ${timestamp.toFixed(2)}`
      }

      // Request the next frame.
      previousTimestamp = timestamp
      //window.requestAnimationFrame(nextFrame)
    }

    drawSceneRef.current()
    applyTransformation(scale, rotateX, rotateY, rotateZ, translateX, translateY, translateZ)
    window.requestAnimationFrame(nextFrame)
  }, [useWireframe, showCube, showXYGrid, showSphere, groups])

  // const applyTransformation = (scale, rotate, translation) => {
  //   if (!lastObject) return

  //   lastObject.setPosition(translation, translation, translation)
  //   lastObject.setRotation(rotation, rotation, rotation)
  //   lastObject.setScale(scale, scale, scale)
  //   lastObject.needsUpdate = true
  //   console.log('Transformations applied:', {
  //     scale: scale,
  //     rotation: rotation,
  //     translation: translation
  //   })
  //   drawSceneRef.current()
  // }

  // Function to toggle cube visibility
  const toggleCube = () => setShowCube(!showCube)

  // Function to toggle XY grid visibility
  const toggleXYGrid = () => setShowXYGrid(!showXYGrid)

  const toggleSphere = () => setShowSphere(!showSphere)

  const removeObjectFromGroup = () => {
    if (groups.length > 0) {
      const updatedGroups = [...groups]
      const lastGroup = updatedGroups[updatedGroups.length - 1]
      if (lastGroup.children.length > 0) {
        lastGroup.remove(lastGroup.children[lastGroup.children.length - 1])
        setGroups(updatedGroups)
      }
    }
  }

  const addObjectToLastGroup = () => {
    if (lastObject && groups.length > 0) {
      const updatedGroups = [...groups]
      updatedGroups[updatedGroups.length - 1].add(lastObject)
      setGroups(updatedGroups)
    }
  }

  const createNewGroup = () => {
    setGroups([...groups, new Group()])
  }

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>
      <button onClick={() => setUseWireframe(!useWireframe)}>{useWireframe ? 'Show Filled' : 'Show Wireframe'}</button>
      <button onClick={toggleCube}>{showCube ? 'Remove Cube' : 'Add Cube'}</button> {/* Toggle cube */}
      <button onClick={toggleXYGrid}>{showXYGrid ? 'Remove XY Grid' : 'Add XY Grid'}</button> {/* Toggle XY grid */}
      <button onClick={toggleSphere}>{showSphere ? 'Remove Sphere' : 'Add Sphere'}</button>
      <button onClick={createNewGroup}>Create New Group</button>
      <button onClick={addObjectToLastGroup}>Add Object to Last Group</button>
      <button onClick={removeObjectFromGroup}>Remove Object From Group</button>
      <button onClick={applyTransformation}>Apply Transformations Manually</button>
      <div>
        <label>Scale: </label>
        <input
          type="range"
          min="-2"
          max="2"
          step="0.1"
          value={scale}
          onChange={e => {
            setNewScale(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
      </div>
      <div>
        <label>Rotate X: </label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotateX}
          onChange={e => {
            setRotateX(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
        <label>Rotate Y: </label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotateY}
          onChange={e => {
            setRotateY(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
        <label>Rotate Z: </label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotateZ}
          onChange={e => {
            setRotateZ(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
      </div>
      <div>
        <label>Translate X: </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={translateX}
          onChange={e => {
            setTranslateX(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
        <label>Translate Y: </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={translateY}
          onChange={e => {
            setTranslateY(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
        <label>Translate Z: </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={translateZ}
          onChange={e => {
            setTranslateZ(parseFloat(e.target.value))
            applyTransformation()
          }}
        />
      </div>
      <div>
        <h2>Groups</h2>
        {groups.map((group, index) => (
          <div key={index}>
            <h3>Group {index + 1}</h3>
            {group.children.map((child, childIndex) => (
              <p key={childIndex}>{child.constructor.name}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />
        <div ref={timestampRef} style={{ position: 'absolute', top: '7px', left: '10px', color: 'black' }}>
          Timestamp: 0.00
        </div>
      </div>
    </article>
  )
}

export default Sandbox
