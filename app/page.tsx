"use client"

import {Joystick} from 'react-joystick-component';
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import useInterval, {Player} from "@/components/game/player";
import {FeatherClass, FeatherView} from "@/components/game/feather";
import {useEffect, useState} from "react";
import Image from "next/image";

const MinX = 180
const MaxX = 460
const DefaultSpeed = 3 // change this to adjust speed of player moving

export default function IndexPage() {

  const [nPlayers, setNPlayers] = useState(2)
  const [feathers, setFeathers] = useState<FeatherClass[]>([])

  const [speed, setSpeed] = useState(0)
  const [playerX, setPlayerX] = useState(320)

  const handleMove = (event: IJoystickUpdateEvent) => {
    setSpeed(event.x ?? 0)
    console.log('moving: ', event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    setSpeed(0)
    console.log('stop: ', event)
  }

  useInterval(() => {
    console.log(speed, playerX)
    if (speed > 0 && playerX < MaxX) {
      setPlayerX(playerX + speed * DefaultSpeed)
    } else if (speed < 0 && playerX > MinX) {
      setPlayerX(playerX + speed * DefaultSpeed)
    }
  }, 20) // 20ms, 50FPS

  useEffect(() => {
    setFeathers([new FeatherClass(nPlayers)])
  }, []);

  return (
    <section className="relative w-full h-full">

      {
        feathers.map((feather, index) => {
          return (
            <Image key={index} src={'/game/feather/feather.png'} alt={'element'} className={'absolute'} width={120} height={60} style={{

            }}></Image>
          )
        })
      }

      <Player player={{blow: '/game/player/A/blow.png', pos: "top"}}/>

      <Player player={{blow: '/game/player/B/blow.png', pos: "bottom", x: playerX}}/>

      <div className={'absolute left-8 bottom-8 flex items-center justify-center'}>

        <Joystick size={100} sticky={false} baseColor="gray" stickColor="blue" move={handleMove}
                  stop={handleStop}></Joystick>

      </div>

      <div
        className={'absolute right-8 bottom-8 flex items-center justify-center'}>蓄力
      </div>

    </section>
  )
}
