import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { masterTagsJsonEntry } from "../controllers/masterTagsController";
import photoController from "../controllers/photoController";
import formidable from "formidable";


const __projectDir = path.resolve()

const tagsRouter = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method == "GET") {
        // all photos
        if (req.url == "/api/tags/raw") {

            let data = (JSON.parse(readFileSync(path.join(__projectDir, 'db/tags.json'), { encoding: 'utf-8' })) as masterTagsJsonEntry[])

            console.log();

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(data.map(ele => ele.name)))
            res.end()

        } else if (req.url == "/api/tags") {

            let data = readFileSync(path.join(__projectDir, 'db/tags.json'), { encoding: 'utf-8' })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(data)
            res.end()
        } else if (/\/api\/tags\/[0-9]+/.test((req.url as string))) {

            try {
                let selectedTag = Number(path.basename(req.url!))

                let data = (JSON.parse(readFileSync(path.join(__projectDir, 'db/tags.json'), { encoding: 'utf-8' })) as masterTagsJsonEntry[])

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(data[selectedTag]))
                res.end()
            } catch (error) {

                // out of index id in master tag json

                res.writeHead(404)
                res.end()
            }

        }

    }

    if (req.method = "POST") {

        if (req.url == "/api/tags") {
            let form = formidable()

            let masterTagData: masterTagsJsonEntry[] = JSON.parse(readFileSync(path.join(__projectDir, 'db/tags.json'), { encoding: 'utf-8' }))

            let data;

            [data,] = await form.parse(req);

            console.log(data);

            let tagsArray: string[] = masterTagData.map(ele => ele.name)

            let newTag: string = (data.name![0] as string).replace('\\', '');


            if (newTag[0] != '#') {
                newTag = '#' + newTag
            }
            console.log(newTag);

            console.log(tagsArray);


            if (tagsArray.includes(newTag)) {

                res.writeHead(400)
                res.end()

            } else {
                let masterTagsJsonEntry: masterTagsJsonEntry = {
                    "id": masterTagData.length,
                    "name": newTag,
                    "popularity": Number(data.popularity![0])
                }

                masterTagData.push(masterTagsJsonEntry)

                console.log(masterTagData);

                writeFileSync(path.join(__projectDir, 'db/tags.json'), JSON.stringify(masterTagData))
                console.log(masterTagsJsonEntry);

                res.writeHead(200)
                res.end()
            }
        }

    }
}
export default tagsRouter