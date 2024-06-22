"use server"
import * as dotenv from 'dotenv'
import { BlobSASPermissions, generateBlobSASQueryParameters, BlobServiceClient, StorageSharedKeyCredential, BlobSASSignatureValues } from '@azure/storage-blob'
import { DetectedObject } from "@tensorflow-models/coco-ssd"
import fetch from 'node-fetch'

const { v4: uuidv4 } = require('uuid')

dotenv.config()

const accountName = process.env.AZURE_STORAGE_NAME as string
const accountKey = process.env.AZURE_STORAGE_KEY as string
const containerName = process.env.AZURE_STORAGE_CONTAINER as string
const connectionString = process.env.CONNECTION_STRING as string
const token = process.env.TELEGRAM_BOT_TOKEN as string
const chatId = process.env.TELEGRAM_CHAT_ID as string

if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')
if (!containerName) throw Error('Azure Storage containerName not found')
if (!connectionString) throw Error('Azure Storage connectionString not found')

const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
)

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
)

export type Detected =  {
    detected: DetectedObject
    picture?: string
}

export async function getPictures(dateFrom: string | number | Date, dateTo: string | number | Date) {
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobs = containerClient.listBlobsFlat()
    const blobsArray = []

    for await (const blob of blobs) {
        blobsArray.push(blob)
    }

    const filteredBlobs = blobsArray.filter(blob => {
        const date = new Date(blob.properties.lastModified)
        return date >= new Date(dateFrom) && date <= new Date(dateTo)
    })

    const images = await Promise.all(filteredBlobs.map(async blob => {
        const imageUrl = await generateSasToken(containerName, blob.name)
        return imageUrl
    }))

    return images
}

export async function sendPicture(body: Detected){
    try{
        const picture = body.picture
        const base64Data =  picture && picture.replace(/^data:image\/webp;base64,/, '')
        const buffer = base64Data && Buffer.from(base64Data, 'base64')
        const blobName = `${uuidv4()}.png`
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        buffer && await blockBlobClient.upload(buffer, buffer.length, {
            blobHTTPHeaders: { blobContentType: "image/png" }
        });
        await blockBlobClient.setMetadata({class : body.detected.class})
        console.log(`Picture uploaded: ${blobName}`)
        //now we can send to the telegram bot too
        const imageUrl = await generateSasToken(containerName, blobName)
        const message = `Detected: ${body.detected.class}, Confidence: ${body.detected.score.toPrecision(2)} \n Picture: ${imageUrl}`
        await sendTelegramMessage(token, chatId, message)
        console.log(`Message sent to telegram: ${message}`)
    }catch(e){
        console.error(e)
    }
}

export async function deletePictures(dateFrom: string | number | Date, dateTo: string | number | Date) {
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobs = containerClient.listBlobsFlat()
    const blobsArray = []

    for await (const blob of blobs) {
        blobsArray.push(blob)
    }

    const filteredBlobs = blobsArray.filter(blob => {
        const date = new Date(blob.properties.lastModified)
        return date >= new Date(dateFrom) && date <= new Date(dateTo)
    })

    await Promise.all(filteredBlobs.map(async blob => {
        const blobClient = containerClient.getBlobClient(blob.name)
        await blobClient.delete()
        console.log(`Blob deleted: ${blob.name}`)
        })
    )
    return filteredBlobs.length


}

const sendTelegramMessage = async (token: string, chatId: string, message: string) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
    return response.json()
}

const generateSasToken = async (containerName: string, blobName: string): Promise<string> => {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(blobName)

    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 12)

    const sasOptions: BlobSASSignatureValues = {
        containerName: containerName,
        blobName: blobName,
        permissions: BlobSASPermissions.parse('r'), // Permission de lecture
        expiresOn: expiryDate
    }
    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()
    const imageUrl = blobClient.url + '?' + sasToken

    return imageUrl
}