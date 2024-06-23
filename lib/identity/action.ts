"use server"

import * as dotenv from 'dotenv'
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables")
const { v4: uuidv4 } = require('uuid')

dotenv.config()

const connectionString = process.env.CONNECTION_STRING as string
const accountName = process.env.AZURE_STORAGE_NAME as string
const accountKey = process.env.AZURE_STORAGE_KEY as string

if (!connectionString) throw Error('Azure Storage connectionString not found')
if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')

const endpoint = "https://"+accountName+".table.core.windows.net"

const credential = new AzureNamedKeyCredential(
    accountName,
    accountKey
)

const tableService = new TableServiceClient(
  endpoint,
  credential
)

const tableName = "PretorianSystem"

async function addUser(user: any) {

  const tableClient = tableService.getTableClient(tableName)
  const entity = {
    PartitionKey: {_: "user"},
    RowKey: {_: uuidv4()},
    ...user
  }
  const query = new odata.Query().filter(`Email eq '${user.Email}'`)
  const {value: existingUsers} = await tableClient.queryEntities(query)

  if (existingUsers.length > 0) {
    return {status: 400, message: "User already exists"}
  }

  try {
    await tableClient.createEntity(entity)
    return {status: 200, message: "User added successfully"}
  } catch (error) {
    return {status: 500, message: "Error adding user"}
  }
}
