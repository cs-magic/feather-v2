"use client"

import {Joystick} from 'react-joystick-component';
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import {Player} from "@/components/player";

export default function IndexPage() {


  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log('moving: ', event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log('stop: ', event)
  }

  return (
    <section className="relative w-full h-full">

      <Player player={{blow: '/player/A/blow.png', pos: "top"}}/>

      <Player player={{blow: '/player/B/blow.png', pos: "bottom"}}/>

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
