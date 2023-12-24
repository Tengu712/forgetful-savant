export class Matrix {
  private readonly m: number[]

  public constructor(raw?: number[]) {
    if (raw === undefined) {
      this.m = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ]
    } else if (raw.length >= 16) {
      this.m = [
        raw[0], raw[1], raw[2], raw[3],
        raw[4], raw[5], raw[6], raw[7],
        raw[8], raw[9], raw[10], raw[11],
        raw[12], raw[13], raw[14], raw[15],
      ]
    } else {
      throw new Error("Matrix(): the length of `raw` parameter must be no fewer than 16: " + raw)
    }
  }

  public clone(): Matrix { return new Matrix(this.m) }

  public get(): Float32Array { return new Float32Array(this.m) }

  public at(i: number, j: number): number { return this.m[4 * j + i] }

  public setAt(i: number, j: number, val: number) { this.m[4 * j + i] = val }

  public mul(m2: Matrix): Matrix {
    const result = new Matrix()
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        let val = 0
        for (let k = 0; k < 4; ++k) {
          val += this.at(i, k) * m2.at(k, j)
        }
        result.setAt(i, j, val)
      }
    }
    return result
  }

  public static identity(): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  public static scaler(x: number, y: number, z: number): Matrix {
    return new Matrix([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ])
  }

  public static rotatorX(r: number): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, Math.cos(r), -Math.sin(r), 0,
      0, Math.sin(r), Math.cos(r), 0,
      0, 0, 0, 1,
    ])
  }

  public static rotatorY(r: number): Matrix {
    return new Matrix([
      Math.cos(r), 0, Math.sin(r), 0,
      0, 1, 0, 0,
      -Math.sin(r), 0, Math.cos(r), 0,
      0, 0, 0, 1,
    ])
  }

  public static rotatorZ(r: number): Matrix {
    return new Matrix([
      Math.cos(r), -Math.sin(r), 0, 0,
      Math.sin(r), Math.cos(r), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  public static translator(x: number, y: number, z: number): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ])
  }
}
