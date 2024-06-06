import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import readPost from "../methods/readPost";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { masterJsonEntry } from "../controllers/masterJsonController";
import photoController from "../controllers/photoController";

const __projectDir = path.resolve()

const filterRouter = async (req: IncomingMessage, res: ServerResponse) => {

    //
    // GET
    //

    if (req.method == "GET") {

        let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
        let masterJsonData: masterJsonEntry[] = JSON.parse(data)

        let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))

        if (index != -1) {
            let originalImageBuffer = await readFileSync(masterJsonData[index].url!)


            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(await sharp(originalImageBuffer).metadata()))
            res.end()
        } else {
            res.writeHead(404)
            res.end()
        }
    }


    if (req.method == "PATCH") {
        if (req.url! == "/api/filters") {
            let postData = JSON.parse(await readPost(req) as string)

            let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
            let masterJsonData: masterJsonEntry[] = JSON.parse(data)

            let index = masterJsonData.map(e => e.id).indexOf(postData.id)

            console.log(index);

            if (index != -1) {

                let originalImageBuffer = readFileSync(masterJsonData[index].url)

                let filteredImageBuffer = await sharp(originalImageBuffer)

                switch (postData.filter) {
                    case "grayscale":
                        await filteredImageBuffer
                            .grayscale()
                        break
                    case "invert":
                        await filteredImageBuffer
                            .negate({ alpha: false })
                        break
                    case "tint":
                        await filteredImageBuffer
                            .tint({ r: 64, g: 0, b: 64 })
                        break
                    case "rotate":
                        await filteredImageBuffer
                            .rotate(-90)
                        break;
                    case "flip":
                        await filteredImageBuffer
                            .flip(true)
                        break
                    case "flop":
                        await filteredImageBuffer
                            .flop(true)
                        break
                    case "sepia":
                        await filteredImageBuffer
                            .recomb([
                                [0.393, 0.769, 0.189],
                                [0.349, 0.686, 0.168],
                                [0.272, 0.534, 0.131]
                            ])
                }

                let fname = path.basename(masterJsonData[index].url, '.png') + '-' + postData.filter + '.png'

                writeFileSync(path.join(__projectDir, path.dirname(masterJsonData[index].url), fname), await filteredImageBuffer.toBuffer())

                await photoController.patchPhoto(postData.id, postData.filter, path.join(path.dirname(masterJsonData[index].url), fname))

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(masterJsonData[index]))
                res.end()
            } else {
                res.writeHead(404)
                res.end()
            }

        }
    }
}

export default filterRouter