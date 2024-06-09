import { createServer } from "http";
import imageRouter from "./modules/routers/imageRouter";
import tagsRouter from "./modules/routers/tagsRouter";
import filterRouter from "./modules/routers/filterRouter";
import getImageRouter from "./modules/routers/getImageRouter"
import authRouter from "./modules/routers/authRouter";

// import path from "path";

let PORT = 3000;

createServer(async (req, res) => {

    console.log(req.url);
    

    if (req.url == "/") {
        res.write('test');
        res.end();
    } 
    else if( req.url!){
        
        await authRouter(req,res)
    }
    else if(req.headers.authorization){
        console.log('test');
        
        if (req.url!.search("/api/photos") != -1) {
            await imageRouter(req, res)
        }
    
        //tags
    
        else if (req.url!.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        }
    
        else if (req.url!.search("/api/filters") != -1) {
            await filterRouter(req, res)
        }
    
        else if (req.url!.search("/api/getImage") != -1) {
    
            await getImageRouter(req, res)
        }
        else if (req.url!.search("/api/getImage") != -1) {
    
            await getImageRouter(req, res)
        }
    } else{
        
        res.writeHead(401)
        res.end()
    }
})
    .listen(PORT, () => console.log(`http://127.0.0.1:${PORT}/`))