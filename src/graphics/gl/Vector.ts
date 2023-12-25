/**
 * A class for convenient manipulation of Four-dimensional vector.
 */
export class Vector {
  private readonly v: number[]

  /**
   * Constructor.
   * @param raw Internal data. If `undefined`, it defaults to the zero vector.
   * @throws if the length of `raw` is fewer than 4.
   */
  constructor(raw?: number[]) {
    if (raw === undefined) {
      this.v = [0, 0, 0, 0]
    } else if (raw.length >= 4) {
      this.v = [raw[0], raw[1], raw[2], raw[3]]
    } else {
      throw new Error("Vector(): the length of `raw` parameter must be no fewer than 4: " + raw)
    }
  }

  /**
   * Clones this vector.
   * @returns a cloned vector.
   */
  public clone(): Vector { return new Vector(this.v) }

  /**
   * To get the internal data as an array.
   * @returns the internal data as an array.
   */
  public get(): Float32Array { return new Float32Array(this.v) }

  /**
   * To get the ith element.
   * @param i Index.
   * @returns the ith element.
   */
  public at(i: number): number { return this.v[i] }

  /**
   * To get the first element.
   * @returns the first element.
   */
  public x(): number { return this.v[0] }

  /**
   * To get the second element.
   * @returns the second element.
   */
  public y(): number { return this.v[1] }

  /**
   * To get the third element.
   * @returns the third element.
   */
  public z(): number { return this.v[2] }

  /**
   * To get the fourth element.
   * @returns the fourth element.
   */
  public w(): number { return this.v[3] }

  /**
   * Sets the ith element to a value 'val'.
   * @param i Index.
   * @param val New value of the ith element.
   */
  public setAt(i: number, val: number) { this.v[i] = val }

  /**
   * Sets the first element to a value 'x'.
   * @param x New value of the first element.
   */
  public setX(x: number) { this.v[0] = x }

  /**
   * Sets the second element to a value 'y'.
   * @param y New value of the second element.
   */
  public setY(y: number) { this.v[1] = y }

  /**
   * Sets the third element to a value 'z'.
   * @param z New value of the third element.
   */
  public setZ(z: number) { this.v[2] = z }

  /**
   * Sets the fourth element to a value 'w'.
   * @param w New value of the fourth element.
   */
  public setW(w: number) { this.v[3] = w }

  /**
   * To obtain the result of multiplying two vectors.
   * @param u Opponent vector.
   * @returns the result of multiplying.
   */
  public mul(u: Vector): Vector {
    return new Vector([
      this.x() * u.x(),
      this.y() * u.y(),
      this.z() * u.z(),
      this.w() * u.w(),
    ])
  }

  /**
   * To obtain the result of dot product.
   * @param u Opponent vector.
   * @returns the result of dot product.
   */
  public dot(u: Vector): number {
    return this.x() * u.x() + this.y() * u.y() + this.z() * u.z() + this.w() * u.w()
  }
}
