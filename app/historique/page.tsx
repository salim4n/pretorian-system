"use client"

import '@tensorflow/tfjs-backend-webgl'
import * as tf from '@tensorflow/tfjs'
import * as React from "react"
import { addDays, format } from "date-fns"
import { BotIcon, Calendar as CalendarIcon, CrossIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn, drawRect } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {  useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getPictures } from "@/lib/send-detection/action"
import Image from "next/image"
import {
    load,
    ObjectDetection,
  } from '@tensorflow-models/coco-ssd'

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function Historique(){
    const actualDate = new Date()
    const actualYear = actualDate.getFullYear()
    const actualMonth = actualDate.getMonth()
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(actualYear, actualMonth, 1),
        to: addDays(new Date(actualYear, actualMonth, 1), 6)
    })
    const [model, setModel] = useState<ObjectDetection>(null)
    const [pictures, setPictures] = useState<string[]>([])
    const [picture, setPicture] = useState<string>("")

    const loadModel = async () => {
        await load().then((model) => {
            setModel(model)
            toast("Modèle chargé avec succès"),{
                description: "Vous pouvez maintenant lancer les détections sur les images.",
                className: "bg-success",
                important: true,
                icon : <BotIcon />
            }
        }).catch((error) => {
            toast("Erreur lors du chargement du modèle", {
                description : error.message,
                className: "bg-error",
                important: true,
                icon : <CrossIcon />
            })
        })
    }

    useEffect(() => {
        tf.setBackend('webgl')
        loadModel()
    }, [])

    async function fetchPicturesFromRange() {
        if (date && date.from && date.to) {
            const fromDateStr = date.from.toISOString()
            const toDateStr = date.to.toISOString()
            const pictures = await getPictures(fromDateStr, toDateStr)
            setPictures(pictures)
        }
    }

    useEffect(() => {
        fetchPicturesFromRange()
    }, [date])

    const canvasRef = useRef<HTMLCanvasElement>(null)

    function handleCreateCanvas(){
        const img = new window.Image()
            img.crossOrigin = "anonymous"
            img.src = picture
            img.onload = async () => {
                const canvas = canvasRef.current
                const context = canvas?.getContext('2d')
                if (context) {
                    context.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
        }
    }


    async function handleRunDetection(){
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.src = picture
        img.onload = async () => {
            const canvas = canvasRef.current
            const context = canvas?.getContext('2d')
            if (context) {
                context.drawImage(img, 0, 0, canvas.width, canvas.height)
                const predictions = model && await model.detect(canvas)
                predictions.forEach((prediction) => {
                    const [x, y, width, height] = prediction.bbox
                    const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`
                    context.strokeStyle = "tomato"
                    context.lineWidth = 2
                    context.font = "20px Arial"
                    context.fillStyle = "tomato"
                    context.fillText(text, x, y)
                    context.rect(x, y, width, height)
                    context.stroke()

                })
            }
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <Card className="m-3">
                <CardContent>
                    <div className={cn("grid gap-2")}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal m-3",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "dd LLL, y")} -{" "}
                                                {format(date.to, "dd LLL, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Selectionner une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>
            <Card className="m-3">
                <CardHeader className="text-center">
                    <strong>
                        {date?.from?.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }) || new Date().toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
                        -
                        {date?.to?.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }) || new Date().toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
                        <br />
                        <span className="text-muted-foreground"> ({pictures.length} detections)</span>
                    </strong>
                </CardHeader>
            </Card>
            <Card className="m-3 w-full lg:col-span-2 flex-grow">
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                        {pictures.map((picture, index) => (
                            <Card key={index} 
                                className="flex flex-col items-center w-full border-transparent"
                            >
                                <CardHeader>
                                    <CardDescription>
                                    <Dialog>
                                        <DialogTrigger>
                                        <Image
                                            src={picture}
                                            alt={"Image de la detection"}
                                            width={200}
                                            height={200}
                                            className="rounded-lg w-full cursor-pointer"
                                            onClick={() => {
                                                setPicture(picture)
                                                handleCreateCanvas()
                                            }}
                                        />
                                          </DialogTrigger>
                                            <DialogContent className='max-w-full max-h-full'>
                                                <DialogHeader className='flex-row'>
                                                    <DialogTitle className='m-2'>
                                                        <Badge variant="default">Detection</Badge>
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                handleRunDetection()
                                                            }}
                                                        >
                                                            Run Detection
                                                        </Button>
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-center">
                                                <canvas 
                                                    ref={canvasRef} 
                                                    width={640} 
                                                    height={480} 
                                                    className='max-w-full max-h-full rounded-lg'
                                                />
                                                </div>
                                                <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setPicture("")
                                                        toast("Detection supprimée")
                                                    }}
                                                >
                                                    Supprimer
                                                </Button>
                                            </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        

    )
}