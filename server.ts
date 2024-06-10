import { createServer } from "http";
import imageRouter from "./modules/routers/imageRouter";
import tagsRouter from "./modules/routers/tagsRouter";
import filterRouter from "./modules/routers/filterRouter";
import getImageRouter from "./modules/routers/getImageRouter"
import authRouter from "./modules/routers/authRouter";
import authController from "./modules/controllers/authController";
import usersRouter from "./modules/routers/usersRouter";

// import path from "path";

let PORT = 3000;

createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    } else if (req.url == "/") {
        res.write('test');
        res.end();
    }
    else if (req.url!.search("/api/getImage") != -1) {

        await getImageRouter(req, res)
    }
    else if (await authController.checkAuth(req)) {

        if (req.url!.search("/api/users") != -1) {
            await usersRouter(req, res)
        }

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
    }
    else if (req.url!.search("/api/auth") != -1) {

        await authRouter(req, res)
    }
    else {

        res.writeHead(403)
        res.end()
    }
})
    .listen(PORT, () => console.log(`http://127.0.0.1:${PORT}/`))