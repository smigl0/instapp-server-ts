import { IncomingMessage, ServerResponse } from "http";
import formidable from "formidable";
import path from "path";
import { existsSync, mkdirSync, renameSync, readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";

import { masterJson } from "./masterJsonController";

const __projectDir = path.resolve()

const uploadDir = './upload'


class PhotoController {
    constructor() { }

    async uploadPhoto(req: IncomingMessage, res: ServerResponse) {

        // this took way more time than i want to admit

        let form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true
        })

        let fields;
        let files;
        [fields, files] = await form.parse(req);

        let albumPath = path.join(uploadDir, fields.album![0])

        console.log(albumPath);

        // throws error if dir exists so ignore
        if (!existsSync(albumPath)) {
            mkdirSync(albumPath)
        }

        renameSync(
            files.file![0].filepath,
            path.join(albumPath, files.file![0].newFilename)
        )

        // writing to master json db :_@

        let myImageEntryJson = {
            "id": randomUUID(),
            "album": fields.album![0],
            "originalName": files!.file![0]!.originalFilename,
            "url": path.join(albumPath, files!.file![0]!.newFilename),
            "changes": "original",
            "history": [
                {
                    "status": "original",
                    "timestamp": + new Date()
                }
            ]
        }

        console.log(myImageEntryJson);

        let masterJsonData = JSON.parse(readFileSync(path.join(__projectDir, 'db/master.json'), 'utf8'))

        masterJsonData.push(myImageEntryJson)

        writeFileSync(path.join(__projectDir, 'db/master.json'), JSON.stringify(masterJsonData))

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(myImageEntryJson))
        res.end()
    }
}

let photoController = new PhotoController

export default photoController