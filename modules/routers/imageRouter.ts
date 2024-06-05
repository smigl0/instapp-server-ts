import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { readFileSync } from "fs";
import { masterJsonEntry } from "../controllers/masterJsonController";
import photoController from "../controllers/photoController";
import formidable from "formidable";

const __projectDir = path.resolve()

const imageRouter = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method == "GET") {


        // all photos
        if (req.url == "/api/photos") {

            let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(data)
            res.end()
        }

        // single photo
        else if (/\/api\/photos\/[0-9,a-f]+/.test(req.url!)) {
            let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
            let masterJsonData: masterJsonEntry[] = JSON.parse(data)

            let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))

            if (index != -1) {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(masterJsonData[index]))
                res.end()
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end()
            }
        } else if (/\/api\/photos\/tags\/[0-9,a-f]+/.test(req.url!)) {

            let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
            let masterJsonData: masterJsonEntry[] = JSON.parse(data)

            let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))

            if (index == -1) {
                res.writeHead(500)
                res.end()
            } else {
                if (masterJsonData[index].tags == undefined) {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.write('[]')
                    res.end()
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify(masterJsonData[index]))
                    res.end()
                }
            }

            console.log(masterJsonData[index]);

        }
    }
    else if (req.method == "POST") {
        if (req.url == '/api/photos') {
            photoController.uploadPhoto(req, res)
        }
    }
    else if (req.method == "PATCH") {

        // add single tag
        if (/\/api\/photos\/tags\/[0-9,a-f]+/.test(req.url!)) {

            let dbData = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
            let masterJsonData: masterJsonEntry[] = JSON.parse(dbData)

            let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))

            let postData;
            let form = formidable();

            [postData,] = await form.parse(req);

            console.log(postData);

            // out of range
            if (index == -1) {
                res.writeHead(500)
                res.end()

            }
            // write my tags
            else {
                if (masterJsonData[index].tags == undefined) {
                    masterJsonData[index].tags = []
                }

                let newTag: string = postData["tagName"]![0]

                if (newTag[0] != '#') {
                    newTag = '#' + newTag
                }

                masterJsonData[index].tags?.push(postData["tagName"]![0])

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(masterJsonData[index].tags))
                res.end()

            }

            console.log(masterJsonData[index]);

        }
    }
    else if (req.method == "DELETE") {

    }
}

export default imageRouter