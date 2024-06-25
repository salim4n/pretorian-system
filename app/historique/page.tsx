import History from "@/components/History";
import { verifySession } from "../lib/identity/session-local";

async function PageHistory (){
    const session = await verifySession()

    return(
        <History />
    )
}

export default PageHistory