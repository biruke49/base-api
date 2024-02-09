const User = require("../../models/users/User");
const Utility = require("../../helpers/utility");
const JwtHelper = require("../../helpers/jwtHelper");
const UserService = require("../../services/users/user.service");

const roles = require("../../helpers/roles");
const jwt = require("jsonwebtoken");
const SessionService = require("../../services/sessions/session.service");
const refreshTokenSecret = process.env.REFRESH_SECRET_TOKEN;

require("dotenv").config();
const AuthController = {
  Login: async (req, res) => {
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send({ message: "Invalid email address or password" });
      return;
    }
    let user;
    try {
      user = await User.findOne({ email: email });

      if (!user) {
        res.status(400).send({ message: "Invalid email address or password" });
        return;
      }
      if (!user.enabled) {
        res
          .status(400)
          .send({
            message: "Your account has been blocked. Please contact the admin",
          });
        return;
      }

      if (!Utility.comparePassword(password, user.password)) {
        res.status(401).json({ message: "Invalid" });
        return;
      }
    } catch (e) {
      res
        .status(500)
        .json({
          error: e.message,
          message: "Unable to process your request, Please try again",
        });
      return;
    }
    const p = {
      id: user._id,
      email: user.email,
      phone_number: user.phone_number,
      name: user.first_name + " " + user.last_name,
      role: user.role,
      fcm_id: "",
      topics: [],
    };
    const token = JwtHelper.GenerateToken(p, "7d");

    const refreshToken = JwtHelper.GenerateRefreshToken(p, "30d");
    const payload = {
      ip_address: "",
      user_agent: "",
      token: token,
      refresh_token: refreshToken,
    };
    SessionService.UpdateUserSession(p.id, payload)
      .then((session) => {})
      .catch((error) => {});
    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      token: token,
      refresh_token: refreshToken,
      user: UserService.ToModel(user),
    });
  },
  logout: async (req, res) => {
    const { userId } = res.jwtPayload;
    SessionService.RemoveSession(userId)
      .then((response) => {
        res.clearCookie("x-refresh-token", {
          httpOnly: true,
          maxAge: 0,
          sameSite: "none",
          secure: true,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
    res.status(200).json({ message: "You have logged out successfully" });
    res.end();
  },

  // UpdatePassword: async (req, res) => {
  //   const { phone_number, newPassword, type } = req.body;
  //   try {

  //     const service = (type == 'passenger') ? PassengerService : DriverService;
  //     const user = await service.CheckPhoneNumber(phone_number);
  //     if (user) {
  //       const updated = await service.UpdatePassword(user, newPassword);
  //       if (updated.modifiedCount > 0) {
  //         return res.json({ message: `password updated successfully for ${type}` });
  //       }
  //     } else {
  //       return res.json({ message: `we couldn't find a ${type} with that phone number!` })
  //     }
  //   } catch (error) {
  //     res.status(505).json({ "error": error.message });
  //   }
  // },
  RefreshToken: async (req, res) => {
    try {
      const cookies = req.cookies;
      let refreshToken = cookies["x-refresh-token"];
      const refreshTokenHeader = req.headers["x-refresh-token"];

      if (refreshTokenHeader) {
        refreshToken = refreshTokenHeader;
      }
      //console.log(refreshToken, refreshTokenHeader);
      if (!refreshToken) {
        res.status(401).send();
        return;
      }
      const payload = jwt.verify(refreshToken, refreshTokenSecret);
      const session = await SessionService.GetUserSession(payload.userId);
      if (!session || session.refresh_token != refreshToken) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      const p = {
        id: payload.userId,
        email: payload.email,
        phone_number: payload.phone_number,
        name: payload.name,
        role: payload.role,
        fcm_id: payload.fcm_id,
        topics: payload.topics,
      };

      const token = JwtHelper.GenerateToken(p, "7d");
      const pp = {
        ip_address: "",
        user_agent: "",
        token: token,
        refresh_token: refreshToken,
      };
      SessionService.UpdateUserSession(payload.userId, pp)
        .then((session) => {})
        .catch((error) => {
          //console.log(error);
        });
      res.status(200).send({ token });
    } catch (error) {
      res.status(403).send();
    }
  },
};
module.exports = AuthController;
