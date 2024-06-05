import { IncomingMessage,ServerResponse } from "http";
import path from "path";
import {readFileSync} from "fs";
import { masterJson } from "../controllers/masterJsonController";
import photoController from "../controllers/photoController";

const __projectDir = path.resolve()

const imageRouter = async (req:IncomingMessage,res:ServerResponse)=> {
    if(req.method == "GET"){
            
        //index
        
        if(req.url == "/"){
            } else

            // all photos
            if(req.url == "/api/photos"){
                
                let data = readFileSync(path.join(__projectDir,'master.json'),{encoding:'utf-8'})
                
                res.writeHead(200, {'Content-Type':'application/json'})
                res.write(data)
                res.end()
            } else

            // single photo
            if(/\/api\/photos\/[0-9,a-f]+/.test(req.url!)){
                let data = readFileSync(path.join(__projectDir,'master.json'),{encoding:'utf-8'})
                let masterJsonData:masterJson[] = JSON.parse(data)

                let index = masterJsonData.map(e => e.id).indexOf(path.basename(req.url!))
                
                if(index!=-1){
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.write(JSON.stringify(masterJsonData[index]))
                    res.end()
                } else{
                    res.writeHead(404, {'Content-Type':'application/json'})
                    res.end()
                }
            }
        }
    else
    if(req.method == "POST"){
        photoController.uploadPhoto(req,res)
    }else
    if(req.method == "PATCH"){

    }else
    if(req.method == "DELETE"){

    }
}

export default imageRouter