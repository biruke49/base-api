const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwtSecret = process.env.jwtSecret;
const refreshTokenSecret = process.env.REFRESH_SECRET_TOKEN;

const JwtHelper = {
    GenerateToken: (user, expiresIn = '1d') => {
        return jwt.sign(
            { userId: user.id, name: user.name, email: user.email, phone_number: user.phone_number, role: user.role, fcm_id: user.fcm_id, topics: user.topics },
            jwtSecret,
            {
                expiresIn: expiresIn
            }
        );
    },
    GenerateRefreshToken: (user, expiresIn = '30d') => {
        return jwt.sign(
            { userId: user.id, name: user.name, email: user.email, phone_number: user.phone_number, role: user.role, fcm_id: user.fcm_id, topics: user.topics },
            refreshTokenSecret,
            {
                expiresIn: expiresIn
            }
        );
    },
    ExpireToken: () => {
        return jwt.sign(
            {
                name: '',
                userId: '',
                email: '',
                phone_number: '',
                role: []
            },
            jwtSecret,
            {
                expiresIn: "1",
            }
        );
    },
    GetJwtPayload: async (req) => {
        const token = req.headers["x-access-token"];
        //Try to validate the token and get data
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            throw Error(error);
        }
    }
}
module.exports = JwtHelper;