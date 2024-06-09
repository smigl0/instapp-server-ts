import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const createToken = () => {

    let token = sign(
        {
            email: "aaa@test.com",
            anyOtherData: "123"
        },
        "superDuperSecretKey",
        {
            expiresIn: "1d" // "1m", "1d", "24h"
        }
    );
    
    return token
}

const verifyToken = (token:string) => {

    try {
        let decoded = verify(token, "superDuperSecretKey")
        return decoded;
    }
    catch {}
}

console.log(verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYUB0ZXN0LmNvbSIsImFueU90aGVyRGF0YSI6IjEyMyIsImlhdCI6MTcxNzc0ODM4MSwiZXhwIjoxNzE3NzQ4Mzk2fQ.v34hFIbsIHL-qdMYlp5-NA6sqhBDKpN604kHJsXbznU")
);

export {createToken,verifyToken}