import { GLWrapper } from "@/graphics/gl/GLWrapper"
import { Sprite } from "./component/graphics/Sprite"
import { ComponentManager } from "./component/ComponentManager"

function main() {
  const gl = new GLWrapper()
  const comManager = new ComponentManager()
  comManager.add(new Sprite([0, 0, 40], undefined, [100, 100], [1, 0, 0, 1]))
  comManager.add(new Sprite([0, 0, -20], undefined, [200, 50], [0, 1, 0, 1]))

  const loop = (timeStamp: DOMHighResTimeStamp) => {
    gl.clear()
    comManager.get(Sprite).forEach((n) => n.draw(gl))
    gl.flush()
    requestAnimationFrame(loop)
  }

  loop(0)
}

document.addEventListener("DOMContentLoaded", main)
