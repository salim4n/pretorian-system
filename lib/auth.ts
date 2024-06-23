// Description: This file contains the configuration for the authentication provider.
import NextAuth, { type NextAuthConfig } from "next-auth"
import { TableStorageAdapter } from "@auth/azure-tables-adapter"
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables"
import Resend from "next-auth/providers/resend"
//test update on azure env
const credential = new AzureNamedKeyCredential(
    process.env.AUTH_AZURE_ACCOUNT,
    process.env.AUTH_AZURE_ACCESS_KEY
  )
  const authClient = new TableClient(
    process.env.AUTH_AZURE_TABLES_ENDPOINT,
    "PretorianSystem",
    credential
  )

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: "ignitionAI@resend.dev"
        }),
    ],
    adapter: TableStorageAdapter(authClient),
} satisfies NextAuthConfig)
