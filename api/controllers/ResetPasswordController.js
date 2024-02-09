const ResetPasswordService = require("../../services/reset-password/reset-password.service");
const ResetPasswordController = {
  ForgotPassword: async (req, res) => {
    try {
      const email = req.body.email;
      if (!(email && email.length > 0)) {
        res
          .status(400)
          .json({ error: "email is required", message: "email is required" });
        return;
      }
      const forgotPassword = await ResetPasswordService.ForgotPassword(email);
      if (!forgotPassword) {
        res
          .status(400)
          .json({
            error: "Can not send your reset password link, Please try again",
            message: "Can not send your reset password link, Please try again",
          });
        return;
      }
      res.status(200).json({ success: true });
      return;
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Unable to process your request, Please try again",
        });
    }
  },
  ResetPassword: async (req, res) => {
    try {
      const reset = await ResetPasswordService.ResetPassword(req.body);
      if (reset) {
        res
          .status(200)
          .json({ message: "Your Password changed successfully!" });
        return;
      }
      res
        .status(400)
        .json({ error: "Unknown error", message: "Unknown error" });
      return;
    } catch (err) {
      res
        .status(500)
        .json({
          error: err.message,
          message: "Unable to process your request, Please try again",
        });
    }
  },
};
module.exports = ResetPasswordController;
