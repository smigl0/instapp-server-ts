import path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from 'fs';
import { masterJsonEntry } from "../controllers/masterJsonController";
import sharp from "sharp";


const __projectDir = path.resolve()

interface imageResponseOptions {
    filter?: string
}

export default async function imageResponse(req: IncomingMessage, res: ServerResponse, options?: imageResponseOptions) {

    let data = readFileSync(path.join(__projectDir, 'db/master.json'), { encoding: 'utf-8' })
    let masterJsonData: masterJsonEntry[] = JSON.parse(data)

    let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))

    if (index != -1) {
        if (options?.filter == undefined) {
            console.log('test');

            res.writeHead(200, { 'Content-type': 'image/png' })
            res.write(await readFileSync(masterJsonData[index].url))
            res.end()
        } else {


            if (options?.filter == "original") {
                let originalImageBuffer = await readFileSync(masterJsonData[index].history[0].url!)

                res.writeHead(200, { 'Content-type': 'image/png' })
                res.write(originalImageBuffer)
                res.end()
            } else {
                let originalImageBuffer = await readFileSync(masterJsonData[index].url!)
                let filteredImageBuffer = await sharp(originalImageBuffer)

                switch (options.filter) {
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




                res.writeHead(200, { 'Content-type': 'image/png' })
                res.write(await filteredImageBuffer.toBuffer())
                res.end()
            }
        }
    } else {
        res.writeHead(404)
        res.end()
    }

    // res.writeHead(200, { 'Content-type': 'image/png' })
    // res.write(await readFileSync(path))
    // res.end()

}