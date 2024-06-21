"use client"


import { NextPage } from 'next';
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as tf from '@tensorflow/tfjs'
import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn, drawRect } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { HTMLAttributes, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getPictures } from "@/lib/send-detection/action"
import Image from "next/image"
import {
    load,
    ObjectDetection,
  } from '@tensorflow-models/coco-ssd'

  interface HistoriqueProps {
    className?: string;
    // Autres props nécessaires
  }

// ts-ignore
const Historique: NextPage<HistoriqueProps> = ({ className }) => {
    const actualDate = new Date()
    const actualYear = actualDate.getFullYear()
    const actualMonth = actualDate.getMonth()
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(actualYear, actualMonth, 1),
        to: addDays(new Date(actualYear, actualMonth, 1), 6)
    })

    const [pictures, setPictures] = useState<string[]>([])
    const canvasRefs = useRef<HTMLCanvasElement[]>([])

    useEffect(() => {
        tf.setBackend('webgl')
        async function fetchPicturesFromRange() {
            if (date && date.from && date.to) {
                const fromDateStr = date.from.toISOString()
                const toDateStr = date.to.toISOString()
                const pictures = await getPictures(fromDateStr, toDateStr)
                setPictures(pictures);
            }
        }
        fetchPicturesFromRange()
    }, [date])

    const handleImageClick = async (picture: string, index: number) => {
        const img = new window.Image();
        img.src = picture;
        img.onload = async () => {
            const net: ObjectDetection = await load();
            const canvas = canvasRefs.current[index];
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                const detections = await net.detect(img);
                drawRect(detections, context);
            }
        };
    };
//
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <Card className="m-3">
                <CardContent>
                    <div className={cn("grid gap-2", className)}>
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
                            <Card key={index} className="flex flex-col items-center w-full border-transparent">
                                <CardHeader>
                                    <CardDescription>
                                        <Image
                                            src={picture}
                                            alt={"Image de la detection"}
                                            width={200}
                                            height={200}
                                            className="rounded-lg w-full cursor-pointer"
                                            onClick={() => handleImageClick(picture, index)}
                                        />
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

export default Historique