"use client"

import {Joystick} from 'react-joystick-component';
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import {Player} from "@/components/game/player";
import {FeatherClass, FeatherComp, IFeatherComp} from "@/components/game/feather";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useElementSize} from "@mantine/hooks"

export default function IndexPage() {

  const [nPlayers, setNPlayers] = useState(2)
  const playerIndex = 0

  const [feathers, setFeathers] = useState<IFeatherComp[]>([])


  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log('moving: ', event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log('stop: ', event)
  }



  const {ref, width, height} = useElementSize()

  useEffect(() => {
    setFeathers([{container: {width, height}, player: {n: nPlayers, k: playerIndex}}])
  }, [width, height]);

  return (
    <section className="relative w-full h-full" ref={ref}>

      {
        feathers
          .map((feather, index) => {
            return (
              <FeatherComp {...feather} key={index}/>
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
