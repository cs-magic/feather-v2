/**
 *
 * @param distance 离极坐标世界系的中心距离，定义域：[0: 1]
 * @param angle 与极坐标世界系中心夹角，定义域：[0: 2pi]
 */
export interface IPolarPos {
  r: number
  theta: number
}

export interface ICartesianPos {
  x: number
  y: number
}
