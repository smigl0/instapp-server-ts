import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { readFileSync } from "fs";
import { masterJson } from "../controllers/masterJsonController";
import photoController from "../controllers/photoController";

const __projectDir = path.resolve()

const tagsRouter = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method == "GET") {


        // all photos
        if (req.url == "/api/tags/raw") {

            let data = readFileSync(path.join(__projectDir, 'master.json'), { encoding: 'utf-8' })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(data)
            res.end()

        } else if (req.url == "/api/tags") {

            let data = readFileSync(path.join(__projectDir, 'master.json'), { encoding: 'utf-8' })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(data)
            res.end()
        }

    }
}
export default tagsRouter