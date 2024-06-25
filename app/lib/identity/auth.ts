"use server"

import * as dotenv from 'dotenv'
import  { TableClient, AzureNamedKeyCredential } from '@azure/data-tables'
const { v4: uuidv4 } = require('uuid')
import bcrypt from 'bcrypt'
import { createSession } from './session-local'

dotenv.config()

const connectionString = process.env.AUTH_AZURE_STORAGE_CONNECTION_STRING as string
const accountName = process.env.AUTH_AZURE_ACCOUNT as string
const accountKey = process.env.AUTH_AZURE_ACCESS_KEY as string

if (!connectionString) throw Error('Azure Storage connectionString not found')
if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')

const credential = new AzureNamedKeyCredential(
    accountName,
    accountKey
)

const client = new TableClient(`https://${accountName}.table.core.windows.net`, "PretorianSystem", credential)

export async function signup(formData: any,device: string){

    const validateResult = { 
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
    }

    const { name,surname, email, password} = validateResult

    // 3. Check if the user's email already exists
    let entitiesIter = client.listEntities()
    let i = 1
    for await (const entity of entitiesIter) {
      console.log(`Entity${i}: PartitionKey: ${entity?.partitionKey} RowKey: ${entity?.rowKey}`)
      i++
      if (entity.email === email){
        return {
          message: 'Cet email existe déjà. Veuillez vous connecter.',
        } as any
      }
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10)
    // create user
    const user = {
      partitionKey: "User",
      rowKey: uuidv4(),
      name,
      surname,
      email,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString(),
      expireDate: "TODO : Paid subscription date",
      device: device
    }

    // 4. Insert the user into the database
     await client.createEntity(user)
      .then(() => {
        createSession(user)
        return {
          message: 'Utilisateur créé avec succès',
          user: user
        }
      })

}
