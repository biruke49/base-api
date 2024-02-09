const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.jwtSecret;
const SessionService = require("../../services/sessions/session.service");

const Authenticate = async (req, res, next) => {
  //Get the jwt token from the head
  const token = req.headers["x-access-token"];
  let jwtPayload;
  if (!token) {
    res.status(403).send({ message: "Access token required" });
    return;
  }
  //Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, jwtSecret);
    // const t = await SessionService.GetUserSession(jwtPayload.userId);
    // if (!t || t.token != token) {
    //   res.status(401).send({ message: "Unauthorized" });
    //   return;
    // }
    res.jwtPayload = jwtPayload;
  } catch (error) {
    console.log("🚀 ~ Authenticate ~ error:", error);
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  next();
};
module.exports = Authenticate;
