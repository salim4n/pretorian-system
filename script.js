
require('dotenv').config()

const connectionString = process.env.CONNECTION_STRING 
const accountName = process.env.AZURE_STORAGE_NAME 
const accountKey = process.env.AZURE_STORAGE_KEY 
const resendKey = process.env.AUTH_RESEND_KEY
const container = process.env.AZURE_STORAGE_CONTAINER
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
const telegramChatId = process.env.TELEGRAM_CHAT_ID
const authSecret = process.env.AUTH_SECRET


console.log(connectionString)
console.log(accountName)
console.log(accountKey)
console.log(resendKey)
console.log(container)
console.log(telegramBotToken)
console.log(telegramChatId)
console.log(authSecret)
