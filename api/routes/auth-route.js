const express = require("express");
const route = express.Router();
const AuthController = require("../controllers/AuthController");
const ResetPasswordController = require("../controllers/ResetPasswordController");

const Authenticate = require("../middleware/authenticate");
const Validator = require("../middleware/validator");
const loginWithEmailSchema = require("../validations/auth/login-with-email-validator");
const forgotPasswordValidator = require("../validations/auth/forgot-password-validator");
const resetPasswordValidator = require("../validations/auth/reset-password-validator");

route.post("/login", Validator(loginWithEmailSchema), AuthController.Login);
route.post("/logout", [Authenticate], AuthController.logout);

route.get("/refresh", AuthController.RefreshToken);
route.post(
  "/forgot-password",
  Validator(forgotPasswordValidator),
  ResetPasswordController.ForgotPassword
);

route.post(
  "/reset-password",
  Validator(resetPasswordValidator),
  ResetPasswordController.ResetPassword
);
module.exports = route;
