import type { NextApiRequest, NextApiResponse } from 'next'
import {  DetectedObject, UserView } from '@/app/lib/identity/definition'
import { deleteSession } from '@/app/lib/identity/session-local'
import {  jwtVerify } from 'jose'
import {  BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import * as dotenv from 'dotenv'
import { generateSasToken } from '@/app/lib/send-detection/action'
import { sendDetection } from '@/app/lib/telegram-bot/action'

const { v4: uuidv4 } = require('uuid')
dotenv.config()

const secretKey = process.env.AUTH_SECRET
const accountName = process.env.AUTH_AZURE_ACCOUNT as string
const accountKey = process.env.AUTH_AZURE_ACCESS_KEY as string

if (!secretKey) throw Error('AUTH_SECRET not found')
if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')

const key = new TextEncoder().encode(secretKey)

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    try{
    const sharedKeyCredential = new StorageSharedKeyCredential(
        accountName,
        accountKey
    )
    
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    )
    const detected: DetectedObject = req.body.detected
    const image = req.body.image
    const cookie = req.body.cookie
    //verify cookie
        const { payload } = await jwtVerify(cookie, key, {
          algorithms: ['HS256'],
        }).catch((e) => {
            console.error(e)
            deleteSession()
            throw Error(`Unauthorized user : ${e} ------ ${cookie}`)
        })
        const user: UserView = {
            id: payload?.userId as string,
            name: payload?.name as string,
            surname: payload?.surname as string,
            chatid: payload?.chatid as string,
            container: payload?.container as string
          }
        const base64Data =  image && image.replace(/^data:image\/webp;base64,/, '')
        const buffer = base64Data && Buffer.from(base64Data, 'base64')
        const blobName = `${uuidv4()}.png`
        const containerClient = blobServiceClient.getContainerClient(user.container)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        await blockBlobClient.upload(buffer, buffer.length)
        await blockBlobClient.setMetadata({class : detected.class})
        const imageUrl = await generateSasToken(user.container, blobName)
        const message = `Detection : ${detected.class}, Confidence: ${detected.score.toPrecision(2)} % \n Image: ${imageUrl}`
        await sendDetection( user.chatid, message)
    }catch(e){
        console.error(e)
        if (e instanceof Error) {
            return res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: 'Internal server error' })
    }
}