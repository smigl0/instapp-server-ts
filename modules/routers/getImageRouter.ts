import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import readPost from "../methods/readPost";
import imageResponse from "../methods/imageResponse";

const __projectDir = path.resolve()



const getImageRouter = async (req: IncomingMessage, res: ServerResponse) => {

    if (req.method == "GET") {

        //
        // GET
        //

        if (/\/api\/getImage\/[0-9,a-f,\-]+$/.test(req.url!)) {



            imageResponse(req, res)

        }
        else if (/\/api\/getImage\/original\/[0-9,a-f,\-]+/.test(req.url!)) {

            console.log('og');

            imageResponse(req, res, { filter: "original" })
        }
        else if (/\/api\/getImage\/[a-z]+\/[0-9,a-f]+/.test(req.url!)) {

            console.log('og + filter');


            imageResponse(req, res, { filter: req.url?.split('/')[3] })


        }
    }
}

export default getImageRouter