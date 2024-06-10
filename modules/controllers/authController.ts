import { IncomingMessage, ServerResponse } from "http";
import formidable from "formidable";
import path from "path";
import { existsSync, mkdirSync, renameSync, readFileSync, writeFileSync } from "fs";
import { genSaltSync, hashSync, compareSync } from "bcryptjs"
import { randomUUID } from "crypto";
import { createAuthToken, createLoginToken } from "../methods/tokenHandler";
import { verifyToken } from "../methods/tokenHandler";
const __projectDir = path.resolve()

const uploadDir = './upload'

var salt: any = genSaltSync(10);

interface masterUsersJsonEntry {
    uuid: string,
    username: string,
    mail: string,
    password: string,
    verified: string
}

class AuthController {
    constructor() { }

    async registerUser(req: IncomingMessage, res: ServerResponse) {

        let successBool = true
        let errormsg: string = "";

        // this took way more time than i want to admit

        let form = formidable(
            //     {
            //     uploadDir: uploadDir,
            //     keepExtensions: true
            // }
        )

        let fields;
        let files;
        [fields, files] = await form.parse(req);

        let masterUsersJsonEntry: masterUsersJsonEntry = {
            uuid: (randomUUID() as string),
            username: fields.username![0],
            mail: fields.mail![0],
            password: hashSync(fields.password![0], salt),
            verified: "false"
        }

        console.log(masterUsersJsonEntry);

        let masterUsersJson: masterUsersJsonEntry[] = JSON.parse(readFileSync(path.join(__projectDir, 'db/users.json'), { encoding: 'utf-8' }))

        for (let i = 0; i < masterUsersJson.length; i++) {
            if (masterUsersJson[i].username == masterUsersJsonEntry.username) {
                errormsg = "Username already in use!"
                successBool = false
                break
            }
            if (masterUsersJson[i].mail == masterUsersJsonEntry.mail) {
                errormsg = "Mail already in use!"
                successBool = false
                break
            }
        }

        if (successBool) {
            masterUsersJson.push(masterUsersJsonEntry)
            res.writeHead(200)
            res.write(createAuthToken({ uuid: masterUsersJsonEntry.uuid }))
            res.end()
            writeFileSync(path.join(__projectDir, 'db/users.json'), JSON.stringify(masterUsersJson))
        } else {
            res.writeHead(401, { "Content-Type": "text/plain" })
            res.write(errormsg as string)
            res.end()
        }


    }

    async verifyUser(req: IncomingMessage, res: ServerResponse) {

        console.log(path.basename(req.url!));

        let tokenValue = verifyToken(path.basename(req.url!)) as masterUsersJsonEntry


        if (tokenValue != undefined) {
            try {
                console.log(tokenValue);

                let masterUsersJson: masterUsersJsonEntry[] = JSON.parse(readFileSync(path.join(__projectDir, 'db/users.json'), { encoding: 'utf-8' }))

                for (let i = 0; i < masterUsersJson.length; i++) {
                    if (masterUsersJson[i].uuid == tokenValue.uuid && masterUsersJson[i].verified == "false") {

                        masterUsersJson[i].verified = "true"
                        writeFileSync(path.join(__projectDir, 'db/users.json'), JSON.stringify(masterUsersJson))

                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                        res.write('Account successfully authorized!')
                        res.end()
                        break
                    }
                }

                res.writeHead(400)
                res.end()

            } catch {
                res.writeHead(400)
                res.end()
            }
        } else {
            res.writeHead(400)
            res.end()
        }
    }

    async loginUser(req: IncomingMessage, res: ServerResponse) {
        let form = formidable()

        let successBool = false

        let files: any, fields: any;
        [fields, files] = await form.parse(req)
        console.log(fields);

        let username = fields.username[0]
        let password = fields.password[0]

        let masterUsersJson: masterUsersJsonEntry[] = JSON.parse(readFileSync(path.join(__projectDir, 'db/users.json'), { encoding: 'utf-8' }))

        let index;
        for (let i = 0; i < masterUsersJson.length; i++) {
            if (masterUsersJson[i].username == username && compareSync(password, masterUsersJson[i].password)) {
                index = i
                successBool = true
                console.log('Login successfull!');
                break
            }
        }

        if (successBool) {

            res.writeHead(200,{'content-type':'text/plain'})
            res.write(createLoginToken(masterUsersJson[index!]))
            res.end()
        } else {
            res.writeHead(401)
            res.write("Invalid username or password")
            res.end()
        }
    }

    async checkAuth(req: IncomingMessage) {
        if (verifyToken(req.headers.authorization!)) {
            return true
        } else {
            return false
        }

    }
}

let authController = new AuthController

export default authController