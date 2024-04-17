**CMSI 3710** Computer Graphics, Spring 2024

# Assignment 0410
This assignment seeks to wrap up the single-frame visual/rendering aspects of your 3D scene.

## Background Reading
As one might expect, the [Shirley/Marscher](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897518/View) text continues to be our go-to source for theoretical and mathematical material. Specific to this assignment, you might find these useful:
* _Chapter 2: Miscellaneous Math_ Section 2.4.4 describes the _cross product_ in detail
* _Chapter 7: Viewing_ talks about projection and the camera
* _Chapter 20: Light_ and _Chapter 24: Global Illumination_ have additional detailed background on lighting

For cross product, the operation itself has been implemented for you in the already-provided `Vector` class. What you want to do is use that function at the right time with the right values.

[Real-Time 3D Graphics with WebGL 2](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897519/View) has multiple points of interest as well:
* _The Camera Matrix_ and succeeding sections provide a similar walk-through as _The Projection Matrix_, but for “cameras”
* The _Lights_ section spells out how to implement lighting in the shaders. As a bonus, you get additional review on GLSL and more conceptual reinforcement of how computer systems model/handle lighting

As before, [GLSL Essentials](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897520/View) emphasizes GLSL rather than mathematics: _Section 3: Vertex Shaders_ > _Drawing a simple geometry sample_ > “Simple Lighting” walks through lighting and provides shader code as well.

The two programming books combined give you two similar but separate examples for camera and lighting implementation, with the same concepts but written in different ways and with different emphases. Pick whatever speaks to your group best—they all lead you in the right direction. And feel free to read further, too.

If you wish to go above and beyond, the [red](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897521/View) and [orange](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897522/View) books go into even greater depth. In particular, Chapter 12 of the orange book describes multiple lighting approaches, culminating in the “ÜberLight” model (with complete shader code!) once used in Pixar’s RenderMan software.

## For Submission
We forge ahead with our 3D library by building out the remaining basics—something commonly called the “fixed function” pipeline. Many more features are possible, of course—texture mapping, fog, shadows, reflection, refraction, different types of material—but they all would build upon what’s here with additional computations in the shader code driven by additional information in your scene graph. But we’ll stop with the following features for now.

### The New Normal
Add support for normal vectors in your shape objects. You may use any technique for generating them, including (correctly) using the functions given to you or writing code of your own. Allow variations that will produce either a faceted or smooth look—the faceted look is achieved by ensuring that every vertex in a triangle has the same normal vector. The smooth look is achieved by giving each vertex a different normal, typically the average of the normals of the triangles that use it. You want to do this because you will then set up…

### Lights!
Implement a lighting model for your 3D framework, using it in your scene-in-progress and enhancing your shaders accordingly. You can go beyond the basics from class or the programming book sections if you wish (e.g., the ÜberLight model described in Chapter 12 of the orange book).

### Camera!
Implement the camera “look-at” transformation matrix in your matrix library and integrate it into your 3D framework. Model and use a camera in your 3D scene. Note that, at this point, you now have full scene layout and navigation capabilities.

### Action...Almost
Your final scene should be looking pretty recognizable at this point, because by the time you implement the features above, you will have nearly everything you’ll need. The scene doesn’t have to be finished, but there should be enough there to demonstrate that you do have lighting and a camera.

## Extra Credit: Texture Mapping
Groups that implement texture mapping in their respective libraries will get extra credit. This is spelled out step by step in the sections from _Textures_ onward in [Real-Time 3D Graphics with WebGL 2](https://brightspace.lmu.edu/d2l/le/content/235198/viewContent/2897519/View). Virtually all of the code is there; this is extra credit primarily because it’s uncertain whether there will be time to cover this fully in class, so doing this successfully will involve some self-study. General outline:
* Learn how to load image data from JavaScript into WebGL
* Add texture coordinates as yet another property for your 3D objects to store
* Use the `texture` function in GLSL to map a texture’s pixels onto a fragment

## How to Turn it In
Commit the following to your repository:
- [Normal vectors](#the-new-normal)
  * Functions for computing normal vectors from a geometry
  * Allow for either faceted (one normal per triangle) or smooth (one normal per vertex) looks
  * Normals are stored with 3D objects
  * Pass normal vectors into GLSL
  * Use normal vectors to perform…
- [Lighting calculations](#lights)
  * Model light sources in your scene framework
  * Pass light source data into GLSL
  * Use light source data to determine colors
- [Camera support](#camera)
  * Add the camera “look-at” matrix to your matrix library
  * Model a camera in your scene framework
  * Integrate the camera transform in your shader code
- [Scene-in-progress](#actionalmost)
  * Demonstrate your 3D library’s features thus far
- (extra credit) [Texture mapping](#extra-credit-texture-mapping)

Because you will be committing future assignments to this same repository, make sure to _tag_ the commit that represents this assignment like so:
```bash
$ git tag assignment-0410
$ git push --tags
```

## Specific Point Allocations
This assignment is scored according to outcomes _1b_, _1c_, _2a_, _2c_, _3a_, _3c_, _3d_, and _4a_–_4f_ in the [syllabus](http://dondi.lmu.build/spring2024/cmsi3710/cmsi3710-spring2024-syllabus.pdf). For this particular assignment, graded categories are as follows:

| Category | Points | Outcomes |
| -------- | -----: | -------- |
| Normal vectors | 30 points total | _1b_, _2c_, _4a_–_4d_ |
| • Computed correctly | 10 points | |
| • Faceted and smooth looks are possible | 5 points | |
| • Stored with 3D objects | 9 points | |
| • Passed into GLSL | 6 points | |
| Lighting | 40 points total | _1c_, _2c_, _3c_, _3d_, _4a_–_4d_ |
| • Modeled in the scene | 10 points | |
| • Passed into GLSL | 10 points | |
| • Correctly combined with normal vectors to determine colors | 20 points | |
| Camera | 20 points total | _1c_, _2a_, _3a_, _3c_, _3d_, _4a_–_4d_ |
| • “Look-at” implemented correctly by the matrix library | 10 points | |
| • Modeled in the scene | 7 points | |
| • Correctly used by shader code | 3 points | |
| Scene-in-progress effectively shows 3D library features | 10 points | _1c_, _4a_–_4d_ |
| Texture mapping | extra credit | _1b_, _2c_, _3c_, _3d_, _4a_–_4d_ |
| Hard-to-maintain or error-prone code | deduction only | _4b_ |
| Hard-to-read code | deduction only | _4c_ |
| Version control | deduction only | _4e_ |
| Punctuality | deduction only | _4f_ |
| **Total** | **100** |

Note that inability to compile and run any code to begin with will negatively affect other criteria, because if we can’t run your code (or commands), we can’t evaluate related remaining items completely.
