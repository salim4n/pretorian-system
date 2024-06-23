// Description: This file contains the configuration for the authentication provider.
import NextAuth, { type NextAuthConfig } from "next-auth"
import { TableStorageAdapter } from "@auth/azure-tables-adapter"
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables"
import Resend from "next-auth/providers/resend"

const connectionString = process.env.CONNECTION_STRING as string
const accountName = process.env.AZURE_STORAGE_NAME as string
const accountKey = process.env.AZURE_STORAGE_KEY as string
const resendKey = process.env.AUTH_RESEND_KEY as string

if (!connectionString) throw Error('Azure Storage connectionString not found')
if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')
if (!resendKey) throw Error('Resend key not found')

const tableUrl = "https://praetorian111.table.core.windows.net/PretorianSystem"
const credential = new AzureNamedKeyCredential(accountName, accountKey)
const authClient = new TableClient(
    tableUrl,
    "PretorianSystem", // Table name
    credential,
)

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Resend({
            apiKey: resendKey,
            from: "ignitionAI@resend.dev"
        }),
    ],
    adapter: TableStorageAdapter(authClient),
} satisfies NextAuthConfig)
