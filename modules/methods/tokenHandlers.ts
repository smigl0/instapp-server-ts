import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const createToken = () => {

    let token = sign(
        {
            email: "aaa@test.com",
            anyOtherData: "123"
        },
        "superSecretKey", // key powinien być zapisany w .env
        {
            expiresIn: "1d" // "1m", "1d", "24h"
        }
    );
    return token
}

const verifyToken = (token: any) => {

    try {
        let decoded = verify(token, "verysecretkey")
        console.log({ decoded: decoded });
    }
    catch (err) {

    }
}


// const processToken = () => {
//     createToken()
// }

export { createToken, verifyToken }