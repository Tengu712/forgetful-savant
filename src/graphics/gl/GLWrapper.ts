const VERTEX_SHADER_IN_POS_LOCATION: number = 0

const VERTEX_SHADER_CODE: string = `#version 300 es
layout (location = 0) in vec4 inPos;
void main() {
  gl_Position = inPos;
}`

const FRAGMENT_SHADER_CODE: string = `#version 300 es
precision highp float;
out vec4 outCol;
void main() {
  outCol = vec4(1.0);
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

export class GLWrapper {
  private readonly gl: WebGL2RenderingContext

  public static readonly VIEWPORT_WIDTH: number = 1280
  public static readonly VIEWPORT_HEIGHT: number = 960

  public constructor() {
    // init canvas
    const canvasOpt = document.getElementById("canvas")
    if (canvasOpt === null) {
      throw new Error("GLWrapper(): failed to get canvas.")
    }
    const canvas = canvasOpt as HTMLCanvasElement
    const resizing = () => {
      let w = window.innerWidth
      let h = window.innerHeight
      if (w * 3 / 4 < h) {
        h = w * 3 / 4
      } else {
        w = h * 4 / 3
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

    // TODO: get locations

    // configure rendering settings
    this.gl.clearColor(0, 0, 0, 1)
    this.gl.viewport(0, 0, GLWrapper.VIEWPORT_WIDTH, GLWrapper.VIEWPORT_HEIGHT)
    this.gl.enable(WebGL2RenderingContext.BLEND)
    this.gl.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA)
  }

  public clear() {
    this.gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT)
  }

  public flush() {
    this.gl.flush()
  }
}
