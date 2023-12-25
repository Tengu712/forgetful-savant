import { IComponent } from "../IComponent"

import { GLWrapper } from "@/graphics/gl/GLWrapper"
import { Matrix } from "@/graphics/gl/Matrix"
import { Vector } from "@/graphics/gl/Vector"

type Position = [number, number, number]
type Rotation = [number, number, number]
type Scale = [number, number]
type Color = [number, number, number, number]

/**
 * A component for drawing a rectangle on the screen.
 */
export class Sprite implements IComponent {
  private enabled: boolean
  public isEnabled(): boolean { return this.enabled }
  public enable(): void { this.enabled = true }
  public disable(): void { this.enabled = false }

  private pos: Position
  private rot: Rotation
  private scl: Scale
  private col: Color

  /**
   * Constructor.
   * 
   * @remarks
   * Initialized in an enabled state.
   * 
   * @param pos Position. If `undefined`, it defaults to `[0, 0, 0]`.
   * @param rot Rotation. If `undefined`, it defaults to `[0, 0, 0]`.
   * @param scl Scale factor. If `undefined`, it defaults to `[1, 1]`.
   * @param col Color. If `undefined`, it defaults to `[0, 0, 0, 0]`.
   */
  public constructor(pos?: Position, rot?: Rotation, scl?: Scale, col?: Color) {
    this.enabled = true
    this.pos = pos === undefined ? [0, 0, 0] : pos
    this.rot = rot === undefined ? [0, 0, 0] : rot
    this.scl = scl === undefined ? [1, 1] : scl
    this.col = col === undefined ? [0, 0, 0, 0] : col
  }

  /**
   * To get the position of this sprite.
   * @returns the position of this sprite.
   */
  public getPosition(): Position { return this.pos }

  /**
   * To get the rotation of this sprite.
   * @returns the rotation of this sprite.
   */
  public getRotation(): Position { return this.rot }

  /**
   * To get the scale of this sprite.
   * @returns the scale of this sprite.
   */
  public getScale(): Scale { return this.scl }

  /**
   * To get the color of this sprite.
   * @returns the color of this sprite.
   */
  public getColor(): Color { return this.col }

  /**
   * Sets the position of this sprite to `pos`.
   * @param pos New value of the position.
   */
  public setPosition(pos: Position) { this.pos = pos }

  /**
   * Sets the rotation of this sprite to `rot`.
   * @param rot New value of the rotation.
   */
  public setRotation(rot: Rotation) { this.rot = rot }

  /**
   * Sets the scale of this sprite to `scl`.
   * @param scale New value of the scale.
   */
  public setScale(scl: Scale) { this.scl = scl }

  /**
   * Sets the color of this sprite to `col`.
   * @param col New value of the color.
   */
  public setColor(col: Color) { this.col = col }

  /**
   * Draws a rectangle on the screen.
   * @param gl Renderer.
   */
  public draw(gl: GLWrapper) {
    gl.draw(
      Matrix.scaler(this.scl[0], this.scl[1], 1),
      Matrix.rotatorX(this.rot[0]).mul(Matrix.rotatorY(this.rot[1]).mul(Matrix.rotatorZ(this.rot[2]))),
      Matrix.translator(this.pos[0], this.pos[1], this.pos[2]),
      new Vector([this.col[0], this.col[1], this.col[2], this.col[3]])
    )
  }
}
