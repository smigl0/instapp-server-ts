import jsonwebtoken from 'jsonwebtoken';

interface masterUsersJsonEntry {
    uuid: string,
    username: string,
    mail: string,
    password: string,
    verified: string
}

const { sign, verify } = jsonwebtoken;

const createToken = (dataToSign: any, expiresIn: string = "1d") => {

    let token = sign(
        dataToSign,
        "superDuperSecretKey",
        {
            expiresIn: expiresIn // "1m", "1d", "24h"
        }
    );

    return token
}

const verifyToken = (token: string) => {

    try {
        let decoded = verify(token, "superDuperSecretKey")
        return decoded;
    }
    catch { }
}

const createAuthToken = (userData: any) => {
    let token = createToken(userData)
    return token
}

const createLoginToken = (userData: masterUsersJsonEntry) => {
    let token = createToken(userData, "1h")
    return token
}

export { createToken, verifyToken, createAuthToken, createLoginToken }