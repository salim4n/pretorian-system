"use client"

import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { useRef, useEffect, useState } from 'react'
import {
    load as cocoSSDLoad,
    type ObjectDetection,
  } from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import { Detected, sendPicture } from '@/lib/send-detection/action'
import { Menubar } from "@radix-ui/react-menubar"
import { useSession } from "next-auth/react"

export default function Board() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>()
  const webcamRef = useRef<Webcam>(null)
  let detectInterval: NodeJS.Timer
  const { data: session, status } = useSession()

  if(status === 'loading'){
    return <div>Loading...</div>
  }

  if(status === 'unauthenticated'){
    return <div>Access denied</div>
  }

  

  async function runCocoSsd(){
    const net = await cocoSSDLoad()
    detectInterval = setInterval(() => {
      runObjectDetection(net)
    }, 1000)
  }

  async function runObjectDetection(net: ObjectDetection) {
    if( webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4){
    const objectDetected = await net.detect(
      webcamRef.current.video,
      undefined,
      0.5
    )
    objectDetected.forEach(async(o) => {
      if(o.class === "person"){
        const body = {
          detected: o,
          picture: webcamRef.current && webcamRef.current.getScreenshot({width: 640, height: 480})
        }
        await sendPicture(body as Detected)
      }
    })

  }
}

  useEffect(() => {
    tf.setBackend('webgl')
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameras(videoDevices)
      })
      runCocoSsd()

      return () => {
        tf.disposeVariables()
    }
  }, [])

  return (
    <div>
      <Menubar />
      {cameras && cameras.map((camera, index) => (
        <Webcam
          audio={false}
          videoConstraints={{
            deviceId: camera.deviceId,
          }}
          ref={webcamRef}
          key={index}
          width={640}
          height={480}
          className='m-1 rounded-md border-yellow-500 border-2'
        />
      ))}
    </div>
  )
}