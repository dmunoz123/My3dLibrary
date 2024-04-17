Here are a few key features and behaviors, showing how three.js chose to design/implement them in comparison to what WebGL expects to receive (as seen in the bare-bones playgrounds). The expectation for your 3D library is for you to design your version of what three.js does, then have that code lead to the information that WebGL receives natively:

| Functionality | How three.js Does It | What WebGL Wants | How you’ll do it |
| -------- | ----- | -------- | ---- |
| Setup/utilities | Create scene, renderer, and camera | `canvas`, assorted settings and functions via the WebGL graphics context; compilation of shader code (all via `canvas.getContext('webgl')`) | 😁 |
| Representation of scene | `Scene` and `Group` objects | Attribute arrays | 😁 |
| Representation of objects | `Geometry` and `Material` ➡ `Mesh` | More attribue arrays (!) | 😁 |
| Drawing the objects | `render` function | Send the vertices and other data into the shaders | 😁 |
| Solid vs. wireframe | `wireframe` property | Choose the right `mode` and vertices | 😁 |
| Breaking out of NDC | `Camera` object | Projection matrix | 😁 |
| Vertex color gradient | Array of colors, one per vertex | `attribute` ➡ `varying` variable | 😁 |
| Group coordination | Group object with its own position, scale, rotation | Modelview matrix (product of instance matrices) | 😁 |
