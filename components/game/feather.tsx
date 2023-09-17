import Image from "next/image";




/**
 *
 * @param distance 离极坐标世界系的中心距离，定义域：[0: 1]
 * @param angle 与极坐标世界系中心夹角，定义域：[0: 2pi]
 */
export interface IPolarPos {
  distance: number
  angle: number
}

export interface ICartesianPos {
  x: number
  y: number
}

export class FeatherClass implements IPolarPos{

  public nPlayers: number // 玩家总数
  public distance: number
  public angle: number

  constructor(nPlayers: number) {

    this.nPlayers = nPlayers
    this.angle = Math.random() * Math.PI * 2 // 初始随机角度
    this.distance = 0 //  初始距离为0

    // 每一秒增加距离1
    setInterval(() => {
      this.distance += .1
    }, 1000)
  }

  /**
   * todo: 世界坐标系内的某点，投射到某位用户坐标系内的位置
   *
   * @param userIndex 用户序号，定义域：[0: nPlayers)
   */
  public toUserPos(userIndex: number):  ICartesianPos{

    return  {
      x: 0,
      y: 0
    }
  }
}


export const FeatherView = ({distance, angle}:IPolarPos) => {

  return (
    <Image src={'/game/element/feather.png'} alt={'element'} width={120} height={60}></Image>
  )
}
