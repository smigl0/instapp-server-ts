import { createServer } from "http";
import imageRouter from "./modules/routers/imageRouter";
import tagsRouter from "./modules/routers/tagsRouter";
// import path from "path";

let PORT = 3000;

createServer(async (req, res) => {
    if (req.url == "/") {
        res.write('penis');
        res.end();
    }

    else if (req.url!.search("/api/photos") != -1) {
        await imageRouter(req, res)
    }

    //tags

    else if (req.url!.search("/api/tags") != -1) {
        await tagsRouter(req, res)
    }
})
    .listen(PORT, () => console.log(`http://127.0.0.1:${PORT}/`))