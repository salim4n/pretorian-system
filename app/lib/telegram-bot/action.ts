"use server"

import * as dotenv from 'dotenv'
import  { TableClient, AzureNamedKeyCredential } from '@azure/data-tables'

dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN as string
const connectionString = process.env.AUTH_AZURE_STORAGE_CONNECTION_STRING as string
const accountName = process.env.AUTH_AZURE_ACCOUNT as string
const accountKey = process.env.AUTH_AZURE_ACCESS_KEY as string

if (!token) throw Error('Telegram Bot token not found')
if (!connectionString) throw Error('Azure Storage connectionString not found')
if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')

const credential = new AzureNamedKeyCredential(
    accountName,
    accountKey
)

const client = new TableClient(`https://${accountName}.table.core.windows.net`, "PretorianSystem", credential)

export const sendDetection = async (chatId: string, message: string) => {
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

export const getChatId = async (text:string) => {
    const url = `https://api.telegram.org/bot${token}/getUpdates`
    const response = await fetch(url)
    let chatId = ''
    const data = await response.json()
    data.result.forEach((element:any) => {
        if (element?.message?.text?.trim()?.toLowerCase()  === text?.trim()?.toLowerCase()) {
            console.log(element.message.chat.id)
            chatId = element.message.chat.id
        }
    })
    return chatId
}