
import Board from "@/components/Board"
import { verifySession } from "../lib/identity/session-local"

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