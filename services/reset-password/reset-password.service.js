const PasswordResetToken = require("../../models/password-reset/PasswordResetToken");
const User = require("../../models/users/User");
const Utility = require("../../helpers/utility");
const crypto = require("crypto");
const Mailer = require("../../helpers/mailer");
require("dotenv").config();
const { CommonEmail } = require("../../config/config");
const ResetPasswordService = {
  ForgotPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`User does not exist with email ${email}`);
      }
      const existedToken = await PasswordResetToken.findOne({ email: email });
      if (existedToken) {
        await PasswordResetToken.deleteMany({ email });
      }
      const token = crypto.randomBytes(32).toString("hex");
      const resetToken = new PasswordResetToken({
        email: email,
        token: Utility.hashPassword(token),
        user_id: user._id,
      }).save();
      const resetPasswordUrl = `${process.env.WEBSITE_DOMAIN}/${process.env.RESET_PASSWORD_URL}?token=${token}&id=${user._id}`;
      const body = {
        user: {
          name: user.first_name + " " + user.last_name,
        },
        url: resetPasswordUrl,
      };
      Mailer.sendEmail(
        user.email,
        "Reset Password",
        body,
        "forgot_password.hbs",
        CommonEmail,
        true
      )
        .then((result) => console.log(result))
        .catch((err) => console.error(err));
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },
  ResetPassword: async (payload) => {
    try {
      const { user_id, token, password } = payload;
      const passwordResetToken = await PasswordResetToken.findOne({ user_id });
      if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
      }
      const isValid = Utility.comparePassword(token, passwordResetToken.token);
      if (!isValid) {
        throw new Error("Invalid or expired password reset token");
      }
      const hash = Utility.hashPassword(password);
      await User.updateOne(
        { _id: user_id },
        { $set: { password: hash } },
        { new: true }
      );
      const user = await User.findById(user_id);
      const loginUrl = `${process.env.WEBSITE_DOMAIN}/${process.env.LOGIN_URL}`;
      const body = {
        user: {
          name: user.first_name + " " + user.last_name,
        },
        url: loginUrl,
      };
      Mailer.sendEmail(
        user.email,
        "Password Reset Successfully",
        body,
        "reset_password.hbs",
        CommonEmail,
        true
      )
        .then((result) => console.log(result))
        .catch((err) => console.error(err));
      await passwordResetToken.deleteOne();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
};
module.exports = ResetPasswordService;
