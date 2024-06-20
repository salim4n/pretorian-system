'use client'

import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { useRef, useEffect, useState } from 'react'
import { load as cocoSSDLoad, type ObjectDetection } from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import { Detected, sendPicture } from '@/lib/send-detection/action'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@radix-ui/react-dropdown-menu'

export default function Board() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const webcamRefs = useRef<Webcam[]>([])
  const [net, setNet] = useState<ObjectDetection | null>(null)
  const [cameraChecked, setCameraChecked] = useState<boolean[]>([])

  async function runCocoSsd() {
    const loadedNet = await cocoSSDLoad()
    setNet(loadedNet)
  }

  async function runObjectDetection(net: ObjectDetection) {
    webcamRefs.current.forEach(async (webcam) => {
      if (webcam !== null && webcam.video?.readyState === 4) {
        const objectDetected = await net.detect(webcam.video, undefined, 0.5)
        objectDetected.forEach(async (o) => {
          if (o.class === "person") {
            const body = {
              detected: o,
              picture: webcam.getScreenshot({ width: 640, height: 480 })
            }
            await sendPicture(body as Detected)
          }
        })
      }
    })
  }

  useEffect(() => {
    tf.setBackend('webgl')
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameras(videoDevices)
        setCameraChecked(videoDevices.map(() => true))
      })
      .then(() => runCocoSsd())

    return () => {
      if (net) {
        net.dispose()
      }
      tf.disposeVariables()
    }
  }, [])

  useEffect(() => {
    if (net) {
      const detectInterval = setInterval(() => {
        runObjectDetection(net)
      }, 3000)
      
      return () => clearInterval(detectInterval)
    }
  }, [net])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      {cameras.map((camera, index) => (
        <Card key={index} className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>{camera.label}</CardTitle>
            <CardDescription>
              <div className="flex item-center">
              <Switch
                id={camera.deviceId}
                defaultChecked
                checked={cameraChecked[index]}
                onCheckedChange={(checked) => {
                  setCameraChecked((prev) => prev.map((_, i) => i === index ? checked : _))
                }}
                className="m-1 relative"
              />
               <strong>
                {
                  cameraChecked[index] ? 'On' : 'Off'
                }
               </strong>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
          {cameraChecked[index] && (
            <Webcam
              audio={false}
              videoConstraints={{
                deviceId: camera.deviceId,
              }}
              ref={(el) => {
                if (el) {
                  webcamRefs.current[index] = el
                }
              }}
              key={index}
              width={640}
              height={480}
              className='m-1 rounded-md border-gray-500 border-2'
            />
          )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}