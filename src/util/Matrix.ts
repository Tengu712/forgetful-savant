/**
 * A class for convenient manipulation of 4x4 matrices.
 * 
 * @remarks
 * In WebGL, matrices must be represented in column-major order, but the methods of this class are agnostic to the representation.
 * That is, row and column indices have the same mathematical meaning.
 */
export class Matrix {
  private readonly m: number[]

  /**
   * Constructor.
   * 
   * If `raw` is `undefined`, it defaults to the zero matrix.
   * 
   * @param raw Internal data. Note that it is transposed.
   * @throws if the length of `raw` is fewer than 16.
   */
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

  /**
   * Clones this matrix.
   * @returns a cloned matrix.
   */
  public clone(): Matrix { return new Matrix(this.m) }

  /**
   * To get the internal data as an array.
   * @returns the internal data as an array.
   */
  public get(): Float32Array { return new Float32Array(this.m) }

  /**
   * To get the element at the ith row and jth column.
   * @param i Row number.
   * @param j Column number.
   * @returns the element at the ith row and jth column.
   */
  public at(i: number, j: number): number { return this.m[4 * j + i] }

  /**
   * Sets the element at the ith row and jth column to a value 'val'.
   * @param i Row number.
   * @param j Column number.
   * @param val New value of the element at the ith row and jth column.
   */
  public setAt(i: number, j: number, val: number) { this.m[4 * j + i] = val }

  /**
   * To obtain the result of right-multiplying the matrix passed as a parameter.
   * @param m2 The matrix on the right-hand side.
   * @returns the result of multiplying.
   */
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

  /**
   * Creates an identity matrix.
   * @returns an identity matrix.
   */
  public static identity(): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Creates a scaler matrix.
   * @param x The scale factor along the X-axis.
   * @param y The scale factor along the Y-axis.
   * @param z The scale factor along the Z-axis.
   * @returns a scaler matrix.
   */
  public static scaler(x: number, y: number, z: number): Matrix {
    return new Matrix([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Creates a rotator matrix around the X-axis.
   * @param r The rotation angle [rad] around the X-axis.
   * @returns a rotator matrix around the X-axis.
   */
  public static rotatorX(r: number): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, Math.cos(r), -Math.sin(r), 0,
      0, Math.sin(r), Math.cos(r), 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Creates a rotator matrix around the Y-axis.
   * @param r The rotation angle [rad] around the Y-axis.
   * @returns a rotator matrix around the Y-axis.
   */
  public static rotatorY(r: number): Matrix {
    return new Matrix([
      Math.cos(r), 0, Math.sin(r), 0,
      0, 1, 0, 0,
      -Math.sin(r), 0, Math.cos(r), 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Creates a rotator matrix around the Z-axis.
   * @param r The rotation angle [rad] around the Z-axis.
   * @returns a rotator matrix around the Z-axis.
   */
  public static rotatorZ(r: number): Matrix {
    return new Matrix([
      Math.cos(r), -Math.sin(r), 0, 0,
      Math.sin(r), Math.cos(r), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Creates a translator matrix.
   * @param x Translation along the X-axis.
   * @param y Translation along the Y-axis.
   * @param z Translation along the Z-axis.
   * @returns a translator matrix.
   */
  public static translator(x: number, y: number, z: number): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ])
  }
}
