// Description: This file contains the configuration for the authentication provider.
import NextAuth, { type NextAuthConfig } from "next-auth"
import { TableStorageAdapter } from "@auth/azure-tables-adapter"
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables"
import Resend from "next-auth/providers/resend"
//test update on azure env

const azureAccount = process.env.AUTH_AZURE_ACCOUNT
const azureAccessKey = process.env.AUTH_AZURE_ACCESS_KEY
const azureTablesEndpoint = process.env.AUTH_AZURE_TABLES_ENDPOINT
const resendKey = process.env.AUTH_RESEND_KEY

if (!azureAccount) throw Error("Azure account not found")
if (!azureAccessKey) throw Error("Azure access key not found")
if (!azureTablesEndpoint) throw Error("Azure tables endpoint not found")
if (!resendKey) throw Error("Resend key not found")

const credential = new AzureNamedKeyCredential(
    azureAccount,
    azureAccessKey
  )
  const authClient = new TableClient(
    azureTablesEndpoint,
    "PretorianSystem",
    credential
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
