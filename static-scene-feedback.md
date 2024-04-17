

## Our 3D Library 12

##### https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-daniel_munoz

| Category | Feedback | Points |
| --- | --- | ---: |
| Stub web app | Stub web app provides testbed for scene library | 5/5 |
| | **Screen construct/framework** | |
| • Setup | No scene abstraction for WebGL could be seen (–4) | 0/4 |
| • Add/remove | Add and removal are done manually, be reconstructing the scene array every time. The hope was that addition and removal would be doable more dynamically, without having to reinitialize `objectsToDraw` every single time (–2) | 2/4 |
| • Rendering | Scene code renders to a `canvas`, but no differently from the original bare-bones sample code (–2) | 2/4 |
| • Implementation | No actual scene abstraction is noted—all of the WebGL setup, configuration, and shader compilation is still directly done in `Sandbox`. This means that other scenes would have to copy/paste this code every time something new is to be created (–3) | 0/3 |
| | **3D object framework** | |
| • Different shapes | Different shapes are possible, but there is not abstracted shape/geometry object: “bare” objects are still used, no different from the sample code (–1) | 1/2 |
| • Color | Colors are supported, but there is no framework for it; code is unchanged from sample (–1) | 1/2 |
| • Groups/composites | Group/composite construct is unfinished and unused (–6) | 2/8 |
| • Implementation | Two geometries are implemented, but the objects are completely independent of each other without a unifying framework (–1) | 2/3 |
| | **Polygon mesh data structure** | |
| • Vertices/triangles | Mesh data structures store vertices and indices, faces, or lines—they are ad hoc per shape and do not adhere to a unifying framework (–4) | 6/10 |
| • Extensibility | The ad hoc nature of the mesh data structures will make it difficult to extend with additional properties later—if new properties are defined, every single geometry file may need to be updated (–3) | 2/5 |
| • Solid vs. wireframe | Wireframe/solid logic is present, but is external to the geometries. The logic is applied at the scene level and needs to be repeated for every object (–2) | 3/5 |
| • Implementation | The mesh implementation remains fairly rudimentary and individualized per geometry—there is hardly any shared code or structure (–2) | 3/5 |
| | **Mesh maker library** | |
| • Sphere | Sphere is implemented correctly | 20/20 |
| • _shape-credits.md_ | Credits present |  |
| • Implementation | Shapes are individually correct but do not leverage any unifying or shared framework (–4) | 6/10 |
| Extra credit (if any) |  |  |
| Code maintainability | There’s an easily fixable warning—unused variable—in the command line. Make it a habit to clean up as things get finalized (–2) | -2 |
| Code readability | Decent readability. |  |
| Version control | Given the size of the work, 7 commits doesn’t show sufficient granularity. Work can definitely be broken up better (–2). At least the commit messages are sufficiently descriptive | -2 |
| Punctuality | Tagged commit made on 3/26 3:16am. ~3 hours late (–1)<br /><br /> **Graded commit:** [b46c9f13848414552725a9a7d67bb73e39c1d39e](https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-daniel_munoz/commit/b46c9f13848414552725a9a7d67bb73e39c1d39e) | -1 |
| | **Total** | **50/90** |
