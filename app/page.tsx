"use client"

import {Joystick} from 'react-joystick-component';
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import {Player} from "@/components/game/player";
import {FeatherClass, FeatherView} from "@/components/game/feather";
import {useEffect, useState} from "react";
import Image from "next/image";

export default function IndexPage() {

  const [nPlayers, setNPlayers] = useState(2)
  const [feathers, setFeathers] = useState<FeatherClass[]>([])


  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log('moving: ', event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log('stop: ', event)
  }

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

      <Player player={{blow: '/game/player/B/blow.png', pos: "bottom"}}/>

      <div className={'absolute left-8 bottom-8 flex items-center justify-center'}>

        <Joystick size={100} sticky={true} baseColor="gray" stickColor="blue" move={handleMove}
                  stop={handleStop}></Joystick>

      </div>

      <div
        className={'absolute right-8 bottom-8 flex items-center justify-center'}>蓄力
      </div>

    </section>
  )
}
