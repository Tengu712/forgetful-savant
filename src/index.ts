import { GLWrapper } from "@/graphics/GLWrapper"
import { Matrix } from "@/util/Matrix"
import { Vector } from "./util/Vector"

function main() {
  const gl = new GLWrapper()

  const loop = (timeStamp: DOMHighResTimeStamp) => {
    gl.clear()
    gl.setColor(new Vector([1, 0, 0, 1]))
    gl.draw(Matrix.scaler(100, 100, 1), Matrix.identity(), Matrix.translator(0, 0, 40))
    gl.setColor(new Vector([0, 1, 0, 1]))
    gl.draw(Matrix.scaler(50, 200, 1), Matrix.identity(), Matrix.translator(0, 0, -20))
    gl.flush()
    requestAnimationFrame(loop)
  }

  loop(0)
}

document.addEventListener("DOMContentLoaded", main)
