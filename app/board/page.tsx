"use server"

import Board from "@/components/Board"
import { verifySession } from "../lib/identity/session-local"
import * as dotenv from 'dotenv'

dotenv.config()
const secretKey = process.env.AUTH_SECRET
if (!secretKey) throw new Error('AUTH_SECRET not found')
const key = new TextEncoder().encode(secretKey)

async function BoardPage() {

  const session = await verifySession()

  const role = session?.role
  if (role === 'admin') {
    console.log("Admin")
  }

  return (
    <Board />
  )
}

export default BoardPage