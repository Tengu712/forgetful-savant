export class Vector {
  private readonly v: number[]

  constructor(raw?: number[]) {
    if (raw === undefined) {
      this.v = [0, 0, 0, 0]
    } else if (raw.length >= 4) {
      this.v = [raw[0], raw[1], raw[2], raw[3]]
    } else {
      throw new Error("Vector(): the length of `raw` parameter must be no fewer than 4: " + raw)
    }
  }

  public clone(): Vector { return new Vector(this.v) }

  public get(): Float32Array { return new Float32Array(this.v) }

  public at(i: number): number { return this.v[i] }

  public x(): number { return this.v[0] }

  public y(): number { return this.v[1] }

  public z(): number { return this.v[2] }

  public w(): number { return this.v[3] }

  public setAt(i: number, val: number) { this.v[i] = val }

  public setX(x: number) { this.v[0] = x }

  public setY(y: number) { this.v[1] = y }

  public setZ(z: number) { this.v[2] = z }

  public setW(w: number) { this.v[3] = w }

  public mul(u: Vector): Vector {
    return new Vector([
      this.x() * u.x(),
      this.y() * u.y(),
      this.z() * u.z(),
      this.w() * u.w(),
    ])
  }

  public dot(u: Vector): number {
    return this.x() * u.x() + this.y() * u.y() + this.z() * u.z() + this.w() * u.w()
  }
}
