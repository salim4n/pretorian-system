import Board from "@/components/Board"
import { verifySession } from "../lib/identity/session-local"
import { UserView } from "../lib/identity/definition"

async function BoardPage() {

  const session = await verifySession()

  const user : UserView = {
    id: session?.userId,
    name: session?.name as string,
    surname: session?.surname as string,
    chatid : session?.chatid as string,
    container : session?.container as string
  }

  console.log(user)

  return (
    <Board
      user={user}
     />
  )
}

export default BoardPage