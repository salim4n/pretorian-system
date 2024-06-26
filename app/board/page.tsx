import Board from "@/components/Board"
import { verifySession } from "../lib/identity/session-local"
import * as dotenv from 'dotenv'

dotenv.config()

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