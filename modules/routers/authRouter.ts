import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { createToken, verifyToken } from "../methods/tokenHandler";
import readPost from "../methods/readPost";

const __projectDir = path.resolve()


const authRouter = async (req: IncomingMessage, res: ServerResponse) => {
    console.log("authRouter");
    
    if (req.method == "GET") {
        if(req.url == "/api/auth/testAuth"){
            console.log("test");
            
            res.writeHead(200,{"set-cookie":`instapp-auth=${createToken()}`})
            // res.writeHead(200)
            res.end()
            
        } else if(req.url = "/api/user/register"){
            let data = await readPost(req)

            console.log(data);
            
            res.end()

        }
    }
    if (req.method == "POST") {
        if(req.url == "/api/testAuth"){
            
            console.log(verifyToken(req.headers.authorization as string));
            
            res.writeHead(200)
            res.end()
            
        }
    }

}

export default authRouter