import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { createToken, verifyToken } from "../methods/tokenHandler";
import formidable from "formidable";
import authController from "../controllers/authController";

const __projectDir = path.resolve()

const authRouter = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method == "GET") {
        if (req.url == "/api/auth/users") {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(readFileSync(path.join(__projectDir, "db/users.json"), { encoding: 'utf-8' }))
            res.end()
        }
        else if (req.url?.search("/api/auth/confirm") != -1) {

            authController.verifyUser(req, res)

        }
    } else
        if (req.method == "POST") {
            if (req.url == "/api/auth/register") {

                authController.registerUser(req, res)

            }

            else if (req.url == "/api/auth/login") {

                authController.loginUser(req, res)

            }
        }

}

export default authRouter