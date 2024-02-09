const yup = require("yup");
const forgotPasswordValidator = yup.object({
  email: yup.string().email().min(8).max(132).required(),
});
module.exports = forgotPasswordValidator;
