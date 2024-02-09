const UserService = require("../../services/users/user.service");
const ObjectId = require("mongoose").Types.ObjectId;
const JwtHelper = require("../../helpers/jwtHelper");
const Utility = require("../../helpers/utility");
const Mailer = require("../../helpers/mailer");
require("dotenv").config();
const multer = require("multer");
const profileImageUploader = require("../middleware/profileImageUploader");
const uploader = profileImageUploader.single("profile_image");
const {
  CommonEmail,
  ResetPassword,
  EmailConfig,
} = require("../../config/config");
const UserController = {
  CheckPhoneNumber: async (req, res) => {
    const phoneNumber = req.query.phone_number;
    if (phoneNumber) {
      try {
        if (await UserService.CheckPhoneNumber(phoneNumber)) {
          res
            .status(200)
            .json({
              message: "User with the given phone number already exists",
            });
          return;
        } else {
          res
            .status(404)
            .json({
              error: "User with the given phone number does not exist",
              message: "User with the given phone number does not exist",
            });
          return;
        }
      } catch (err) {
        res
          .status(500)
          .json({
            error: err.message,
            message: "Unable to process your request, please try again",
          });
      }
    } else {
      res
        .status(400)
        .json({
          error: "Phone number is required",
          message: "Phone number is required",
        });
    }
  },
  CheckEmail: async (req, res) => {
    const email = req.query.email;
    if (email) {
      try {
        if (await UserService.CheckEmail(email)) {
          res
            .status(200)
            .json({ message: "User with the given email already exists" });
          return;
        } else {
          res
            .status(404)
            .json({
              error: "User with the given email does not exist",
              message: "User with the given email does not exist",
            });
          return;
        }
      } catch (err) {
        res
          .status(500)
          .json({
            error: err.message,
            message: "Unable to process your request, please try again",
          });
      }
    } else {
      res
        .status(400)
        .json({ error: "Email is required", message: "Email is required" });
    }
  },
  CreateUser: async (req, res) => {
    const userAttribute = req.body;
    if (
      userAttribute.email &&
      !(await UserService.CheckEmail(userAttribute.email))
    ) {
      const randPass = Utility.generatePassword(4);
      userAttribute.password = randPass;
      userAttribute.created_by = res.jwtPayload.userId;
      try {
        const user = await UserService.CreateUser(userAttribute);
        if (!user) {
          res
            .status(400)
            .json({ message: "Cannot create a user, please try again" });
          return;
        }
        const body = {
          credential: {
            email: user.email,
            password: randPass,
            name: user.first_name + " " + user.last_name,
          },
          loginUrl: ResetPassword.LoginUrl,
        };
        Mailer.sendEmail(
          user.email,
          ResetPassword.Subject,
          body,
          "send_password.hbs",
          CommonEmail,
          true
        )
          .then((result) => console.log(result))
          .catch((err) => console.error(err));
        res.status(200).json({ user: UserService.ToModel(user) });
        res.end();
      } catch (err) {
        console.log(err.message)
        res
          .status(500)
          .json({
            error: err.message,
            message: "Unable to process your request, please try again",
          });
        res.end();
      }
    } else {
      res.status(400).json({ message: "User already found with this email" });
    }
  },
  UpdateProfile: async (req, res) => {
    try {
      const newAttribute = req.body;
      const userId = res.jwtPayload.userId;
      newAttribute.updated_by = userId;
      const response = await UserService.UpdateUser(userId, newAttribute);
      if (response) {
        res
          .status(200)
          .json({ success: true, user: UserService.ToModel(response) });
      } else {
        res
          .status(404)
          .json({
            success: false,
            error: `User does not found with id ${userId}`.message,
            message: `User does not found with id ${userId}`,
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  UpdateUser: async (req, res) => {
    try {
      const newAttribute = req.body;
      const userId = req.query.user_id;
      newAttribute.updated_by = res.jwtPayload.userId;
      if (userId && ObjectId.isValid(userId)) {
        const response = await UserService.UpdateUser(userId, newAttribute);
        if (response) {
          res
            .status(200)
            .json({ success: true, user: UserService.ToModel(response) });
        } else {
          res
            .status(404)
            .json({
              success: false,
              error: `User does not found with id ${userId}`.message,
              message: `User does not found with id ${userId}`,
            });
        }
        return;
      }
      res
        .status(404)
        .json({
          success: false,
          error: `User is required`.message,
          message: `User is required`,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  UpdateUserImage: async (req, res) => {
    await uploader(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        //console.log(err);
        res.status(500).json({ error: err });
        return;
      } else if (err) {
        res.status(500).json({ error: err });
        return;
      }
      const p = req.file.destination.split("/");
      const filePath = p[p.length - 1] + "/" + req.file.filename;
      try {
        const userId = res.jwtPayload.userId;
        const response = await UserService.UpdateProfileImage(
          userId,
          filePath,
          res.jwtPayload.userId
        );
        if (response) {
          res
            .status(200)
            .json({ success: true, user: UserService.ToModel(response) });
        } else {
          res
            .status(404)
            .json({
              success: false,
              error: "User does not found",
              message: "User does not found",
            });
        }
      } catch (error) {
        res
          .status(500)
          .json({
            error: error.message,
            message: "Unable to process your request, please try again",
          });
      }
    });
  },
  GetUser: async (req, res) => {
    const userId = req.params.id;
    if (userId && ObjectId.isValid(userId)) {
      try {
        const user = await UserService.GetUserById(userId);
        res.status(200).json(UserService.ToModel(user));
        return;
      } catch (err) {
        res
          .status(500)
          .json({
            error: err.message,
            message: "Unable to process your request, please try again",
          });
      }
    }
    res
      .status(404)
      .json({ error: "User not found", message: "User not found" });
  },
  GetUsers: async (req, res) => {
    console.log("🚀 ~ GetUsers: ~ req:", req);
    try {
      const { count, users } = await UserService.GetUsers(req.query);
      res.status(200).json({ total: count, items: users });
      return;
    } catch (err) {
      console.log("error from getting users", err);
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  GetCurrentUser: async (req, res) => {
    try {
      const userId = res.jwtPayload.userId;
      const currentUser = await UserService.GetUserById(userId);
      res.status(200).json(UserService.ToModel(currentUser));
    } catch (err) {
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  ActivateUser: async (req, res) => {
    try {
      const userId = req.body.id;
      if (!(userId && ObjectId.isValid(userId))) {
        res
          .status(400)
          .json({ error: "Incorrect user id format or empty user_id" });
        return;
      }
      const response = await UserService.UpdateStatus(
        userId,
        true,
        res.jwtPayload.userId
      );
      if (response) {
        res.status(200).json(UserService.ToModel(response));
        return;
      }
      res
        .status(404)
        .json({
          error: `User does not found with id ${userId}`,
          message: `User does not found with id ${userId}`,
        });
      return;
    } catch (err) {
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  BlockUser: async (req, res) => {
    try {
      const userId = req.body.id;
      if (!(userId && ObjectId.isValid(userId))) {
        res
          .status(400)
          .json({ error: "Incorrect user id format or empty user_id" });
        return;
      }
      const response = await UserService.UpdateStatus(
        userId,
        false,
        res.jwtPayload.userId
      );
      if (response) {
        res.status(200).json(UserService.ToModel(response));
        return;
      }
      res
        .status(404)
        .json({
          error: `User does not found with id ${userId}`,
          message: `User does not found with id ${userId}`,
        });
      return;
    } catch (err) {
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  GetRoles: async (req, res) => {
    try {
      res.status(200).json({ roles: Object.values(roles) });
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  ResetPassword: async (req, res) => {},
  ChangePassword: async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;
    try {
      if (
        current_password &&
        current_password.length >= 4 &&
        new_password &&
        new_password.length >= 4
      ) {
        if (new_password === confirm_password) {
          const userId = await res.jwtPayload.userId;
          const currentUser = await UserService.GetUserById(userId);
          if (Utility.comparePassword(current_password, currentUser.password)) {
            const user = await UserService.UpdatePassword(
              currentUser,
              new_password
            );
            res
              .status(200)
              .json({
                message: "Your password has been changed successfully!!",
                user: user,
              });
            res.end();
          } else {
            res.status(400).json({ message: "Incorrect old password" });
            return;
          }
        } else {
          res.status(400).json({ message: "Please confirm your password" });
          return;
        }
      } else {
        res
          .status(400)
          .json({
            message: "Please enter at least 4 characters for your password",
          });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  CountUsers: async (req, res) => {
    try {
      const count = await UserService.CountUsers(req.query);
      res.status(200).json({ count });
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
  GroupAndCountUsers: async (req, res) => {
    try {
      const data = await UserService.GroupAndCountUsers(req.query);
      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, please try again",
        });
    }
  },
};
module.exports = UserController;
