const yup = require("yup");
const resetPasswordValidator = yup.object({
  user_id: yup.string().min(6).max(132).required(),
  password: yup.string().min(4).max(32).required(),
  token: yup.string().min(30).required(),
});
module.exports = resetPasswordValidator;
