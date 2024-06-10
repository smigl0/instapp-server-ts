import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { masterJsonEntry } from "../controllers/masterJsonController";
import { readFileSync } from "fs"

interface masterUsersJsonEntry {
    uuid: string,
    username: string,
    mail: string,
    password: string,
    verified: string
}

const __projectDir = path.resolve()

const usersRouter = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method == "GET") {
        if (/\/api\/users\/[0-9,a-z,A-Z]+/.test(req.url!)) {
            console.log(path.basename(req.url!));

            let username = path.basename(req.url!)
            let masterUsersJson: masterUsersJsonEntry[] = JSON.parse(readFileSync(path.join(__projectDir, 'db/users.json'), { encoding: 'utf-8' }))
            let index = -1;

            for (let i = 0; i < masterUsersJson.length; i++) {
                if (masterUsersJson[i].username == username) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                res.writeHead(200)
                res.write(masterUsersJson[index])
                res.end()
            } else {
                res.writeHead(404)
                res.end()
            }

        }
    }
}

export default usersRouter