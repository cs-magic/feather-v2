/**
 *
 * @param distance 离极坐标世界系的中心距离，定义域：[0: 1]
 * @param angle 与极坐标世界系中心夹角，定义域：[0: 2pi]
 * @param invert 是否被吹，未来还可以扩展接口为方向角（较为麻烦）
 */
export interface IPolarPos {
  r: number
  theta: number
  invert?: boolean
}

export interface ICartesianPos {
  x: number
  y: number
}
