import { IncomingMessage, ServerResponse } from "http";


export default async function readPost(req: IncomingMessage) {

    return new Promise((resolve) => {
        let body = "";

        req.on("data", (data) => {
            body += data.toString();
        })

        req.on("end", (data: any) => {
            resolve(body)
        })
    })


}