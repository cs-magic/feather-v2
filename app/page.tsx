"use client"

import {Joystick} from 'react-joystick-component';
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import {useState} from "react";
import Image from "next/image";

export enum PlayerAction {
  blow = '/player/blow.png',
}

export default function IndexPage() {

  const [player, setPlayer] = useState<PlayerAction>(PlayerAction.blow)

  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log('moving: ', event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log('stop: ', event)
  }

  return (
    <section className="relative w-full h-full">
      <h1 className={'text-xl text-center bg-cyan-800 py-4 '}>李佳琦吹羽毛</h1>


        <Image src={player} alt={'player'} width={120} height={360} className={'absolute bottom-0 w-[20%]'} style={{
          left: 320
        }}/>

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
