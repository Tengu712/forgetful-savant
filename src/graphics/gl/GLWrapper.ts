import { Matrix } from "@/graphics/gl/Matrix"
import { Vector } from "@/graphics/gl/Vector"

const VERTEX_SHADER_IN_POS_LOCATION: number = 0

const VERTEX_SHADER_IN_UV_LOCATION: number = 1

const VERTEX_SHADER_CODE: string = `#version 300 es
layout (location = 0) in vec4 inPos;
layout (location = 1) in vec4 inUV;
uniform mat4 uniScl;
uniform mat4 uniRot;
uniform mat4 uniTrs;
uniform mat4 uniProj;
uniform vec4 uniCol;
out vec4 v2fCol;
void main() {
  gl_Position = uniProj * uniTrs * uniRot * uniScl * inPos;
  v2fCol = uniCol;
}`

const FRAGMENT_SHADER_CODE: string = `#version 300 es
precision highp float;
in vec4 v2fCol;
out vec4 outCol;
void main() {
  outCol = v2fCol;
}`

function createShader(gl: WebGL2RenderingContext, type: number, code: string): WebGLShader {
  const shader = gl.createShader(type)
  if (shader === null) {
    throw new Error("createShader(): failed to create a shader: " + type)
  }
  gl.shaderSource(shader, code)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, WebGL2RenderingContext.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    throw new Error("createShader(): failed to compile a shader: " + type)
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram()
  if (program === null) {
    throw new Error("createProgram(): failed to create a program.")
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, WebGL2RenderingContext.LINK_STATUS)) {
    gl.deleteProgram(program)
    throw new Error("createProgram(): failed to link a program.")
  }
  return program
}

function getUniLoc(gl: WebGL2RenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation {
  const loc = gl.getUniformLocation(program, name)
  if (loc === null) {
    throw new Error("getUniLoc(): failed to get a uniform location: " + name)
  }
  return loc
}

function createBuffer(gl: WebGL2RenderingContext, type: number, typedDataArray: Float32Array | Uint16Array): WebGLBuffer {
  const buffer = gl.createBuffer()
  if (buffer === null) {
    throw new Error("createBuffer(): failed to create a buffer: " + type)
  }
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, typedDataArray, WebGL2RenderingContext.STATIC_DRAW)
  gl.bindBuffer(type, null)
  return buffer
}

/**
 * A class for rendering 3D graphics objects to the canvas with id=canvas.
 * 
 * @remarks
 * 
 * It renders to the canvas with id=canvas on the page.
 * The canvas automatically resizes to maintain a 4:3 aspect ratio based on the screen size.
 * 
 * It follows the following specifications:
 * - Camera horizontal range: [-640, 640], positive towards the right
 * - Camera vertical range: [-480, 480], positive upwards
 * - Camera depth range: [-50, 50], positive towards the front
 * - Culling: Disabled
 * - Depth testing: Enabled
 * - Clear color: Black
 */
export class GLWrapper {
  public static readonly VIEWPORT_WIDTH: number = 1280
  public static readonly VIEWPORT_HEIGHT: number = 960
  public static readonly VIEWPORT_DEPTH: number = 100

  private readonly gl: WebGL2RenderingContext
  private readonly uniSclLoc: WebGLUniformLocation
  private readonly uniRotLoc: WebGLUniformLocation
  private readonly uniTrsLoc: WebGLUniformLocation
  private readonly uniColLoc: WebGLUniformLocation

  /**
   * Constructor.
   * @throws if the operation fails.
   */
  public constructor() {
    // get canvas
    const canvasOpt = document.getElementById("canvas")
    if (canvasOpt === null) {
      throw new Error("GLWrapper(): failed to get canvas.")
    }
    const canvas = canvasOpt as HTMLCanvasElement

    // set auto resizing system
    const resizing = () => {
      let w = window.innerWidth
      let h = window.innerHeight
      if (w * GLWrapper.VIEWPORT_HEIGHT / GLWrapper.VIEWPORT_WIDTH < h) {
        h = w * GLWrapper.VIEWPORT_HEIGHT / GLWrapper.VIEWPORT_WIDTH
      } else {
        w = h * GLWrapper.VIEWPORT_WIDTH / GLWrapper.VIEWPORT_HEIGHT
      }
      canvas.width = w
      canvas.height = h
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
    }
    resizing()
    window.addEventListener("resize", resizing)

    // init WebGL2
    const glOpt = canvas.getContext("webgl2")
    if (glOpt === null) {
      throw new Error("GLWrapper(): failed to get webgl2 context.")
    }
    this.gl = glOpt

    // init shader program
    const vertShader = createShader(this.gl, WebGL2RenderingContext.VERTEX_SHADER, VERTEX_SHADER_CODE)
    const fragShader = createShader(this.gl, WebGL2RenderingContext.FRAGMENT_SHADER, FRAGMENT_SHADER_CODE)
    const program = createProgram(this.gl, vertShader, fragShader)
    this.gl.useProgram(program)

    // get locations
    this.uniSclLoc = getUniLoc(this.gl, program, "uniScl")
    this.uniRotLoc = getUniLoc(this.gl, program, "uniRot")
    this.uniTrsLoc = getUniLoc(this.gl, program, "uniTrs")
    const uniProjLoc = getUniLoc(this.gl, program, "uniProj")
    this.uniColLoc = getUniLoc(this.gl, program, "uniCol")

    // set projection matrix
    const matProj = new Float32Array([
      2 / GLWrapper.VIEWPORT_WIDTH, 0, 0, 0,
      0, 2 / GLWrapper.VIEWPORT_HEIGHT, 0, 0,
      0, 0, -2 / GLWrapper.VIEWPORT_DEPTH, 0,
      0, 0, 0, 1,
    ])
    this.gl.uniformMatrix4fv(uniProjLoc, false, matProj)

    // set color vector
    const vecCol = new Float32Array([1, 1, 1, 1])
    this.gl.uniform4fv(this.uniColLoc, vecCol)

    // configure rendering settings
    //   clear color
    this.gl.clearColor(0, 0, 0, 1)
    //   viewport
    this.gl.viewport(0, 0, GLWrapper.VIEWPORT_WIDTH, GLWrapper.VIEWPORT_HEIGHT)
    //   disable culling
    this.gl.disable(WebGL2RenderingContext.CULL_FACE)
    //   enable depth test
    this.gl.enable(WebGL2RenderingContext.DEPTH_TEST)
    this.gl.depthFunc(WebGL2RenderingContext.LEQUAL)
    this.gl.clearDepth(1.0)
    //   enable blending
    this.gl.enable(WebGL2RenderingContext.BLEND)
    this.gl.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA)

    // create and bind square model
    const vtxs = new Float32Array([
      // bottom-left
      -0.5, -0.5, 0.0, 1.0,
      0.0, 1.0,
      // bottom-right
      0.5, -0.5, 0.0, 1.0,
      1.0, 1.0,
      // up-right
      0.5, 0.5, 0.0, 1.0,
      1.0, 0.0,
      // up-left
      -0.5, 0.5, 0.0, 1.0,
      0.0, 0.0,
    ])
    const idxs = new Uint16Array([0, 1, 2, 0, 2, 3])
    const vtxBuffer = createBuffer(this.gl, this.gl.ARRAY_BUFFER, vtxs)
    const idxBuffer = createBuffer(this.gl, this.gl.ELEMENT_ARRAY_BUFFER, idxs)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vtxBuffer)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, idxBuffer)

    // enable vertex attribute arrays
    // NOTE: it must be processed after model buffers is binded.
    this.gl.enableVertexAttribArray(VERTEX_SHADER_IN_POS_LOCATION)
    this.gl.enableVertexAttribArray(VERTEX_SHADER_IN_UV_LOCATION)
    this.gl.vertexAttribPointer(
      VERTEX_SHADER_IN_POS_LOCATION,
      4,
      WebGL2RenderingContext.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT * 6,
      Float32Array.BYTES_PER_ELEMENT * 0
    )
    this.gl.vertexAttribPointer(
      VERTEX_SHADER_IN_UV_LOCATION,
      2,
      WebGL2RenderingContext.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT * 6,
      Float32Array.BYTES_PER_ELEMENT * 4
    )
  }

  /**
   * Clears the screen.
   * 
   * @remarks
   * It should be called before rendering in every frame.
   */
  public clear() {
    this.gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT)
  }

  /**
   * Updates the actual screen with the current rendering state.
   * 
   * @remarks
   * It should be called at the end of every frame after rendering.
   */
  public flush() {
    this.gl.flush()
  }

  /**
   * Draws a square.
   * @param matScl Scaler matrix.
   * @param matRot Rotator matrix,
   * @param matTrs Translator matrix.
   * @param vecCol Color vector.
   */
  public draw(matScl: Matrix, matRot: Matrix, matTrs: Matrix, vecCol: Vector) {
    this.gl.uniformMatrix4fv(this.uniSclLoc, false, matScl.get())
    this.gl.uniformMatrix4fv(this.uniRotLoc, false, matRot.get())
    this.gl.uniformMatrix4fv(this.uniTrsLoc, false, matTrs.get())
    this.gl.uniform4fv(this.uniColLoc, vecCol.get())
    this.gl.drawElements(
      WebGL2RenderingContext.TRIANGLES,
      6,
      WebGL2RenderingContext.UNSIGNED_SHORT,
      0
    )
  }
}
