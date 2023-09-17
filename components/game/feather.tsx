import {useEffect, useState} from "react";
import Image from "next/image";

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

export class FeatherClass implements IPolarPos {

  public nPlayers: number // 玩家总数
  public r: number
  public theta: number

  constructor(nPlayers: number) {

    this.nPlayers = nPlayers
    this.theta = Math.random() * Math.PI * 2 // 初始随机角度
    this.r = 0 //  初始距离为0

    // 每一秒增加距离1
    setInterval(() => {
      this.r += .1
    }, 1000)
  }

  /**
   * todo: 世界坐标系内的某点，投射到某位用户坐标系内的位置
   *
   * @param userIndex 用户序号，定义域：[0: nPlayers)
   */
  public toUserPos(userIndex: number): ICartesianPos {
    const theta_k = this.theta - (userIndex / this.nPlayers) * 2 * Math.PI
    const is_in_user_space = Math.abs(theta_k) < 2 * Math.PI / this.nPlayers
    const center_x = theta_k / ((is_in_user_space ? 1 / this.nPlayers : (1 - 1 / this.nPlayers)) * Math.PI)
    const center_y = is_in_user_space ? this.r : -this.r
    return {
      x: (center_x + 1) / 2,
      y: (center_y + 1) / 2
    }
  }
}

export interface IFeatherComp {
  container: {
    width: number
    height: number
  }
  player: {
    n: number
    k: number
  }
}

export const toUserPos = (pos: IPolarPos, k: number, n: number): ICartesianPos => {
  const theta_k = pos.theta - (k / n) * 2 * Math.PI
  const is_in_user_space = Math.abs(theta_k) < Math.PI / n
  const center_x = theta_k / ((is_in_user_space ? 1 / n : (1 - 1 / n)) * 2 * Math.PI)
  const center_y = is_in_user_space ? pos.r : -pos.r
  const x = (center_x + 1) / 2
  const y = (center_y + 1) / 2
  console.log({pos, k, n, theta_k, x, y})
  return {
    x,
    y
  }
}

export const FeatherComp = ({player, container}: IFeatherComp) => {
  const {n, k} = player
  const [pos, setPos] = useState<IPolarPos>({r: 0, theta: (Math.random() - .5) * 2 * Math.PI})

  useEffect(() => {
    // 每一秒增加距离1
    const interval = setInterval(() => {
      setPos((pos) => {
        console.log("pos before: ", pos)
        return ({...pos, r: pos.r + .1})
      })
    }, 1000)
    return () => clearInterval(interval)
  }, []);

  const {x, y} = toUserPos(pos, k, n)
  console.log({container, x, y})

  return (
    <Image src={'/game/feather/feather.png'} alt={'element'} className={'absolute'} width={120}
           height={60} style={{
      left: container.width * x,
      top: container.height * y
    }}></Image>
  )
}
