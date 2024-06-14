import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/src/lib/prisma"

const githubId = process.env.AUTH_GITHUB_ID
const githubSecret = process.env.AUTH_GITHUB_SECRET

if(!githubId || !githubSecret) {
  throw new Error("GITHUB_ID and GITHUB_SECRET must be provided")
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
    // ...add more providers here
  ],
  adapter: PrismaAdapter(prisma),
} satisfies NextAuthOptions


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }