import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  theme: {
    logo: "../icon.jpeg",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    session({ session, user }) {
        session.user.id = user.id;
      return session;
    },
  },
  providers: [
    GitHub
  ],
})