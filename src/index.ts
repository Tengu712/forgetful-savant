import { GLWrapper } from "@/graphics/gl/GLWrapper"

function main() {
  const gl = new GLWrapper()

  const loop = (timeStamp: DOMHighResTimeStamp) => {
    gl.clear()
    gl.flush()
    requestAnimationFrame(loop)
  }

  loop(0)
}

document.addEventListener("DOMContentLoaded", main)
