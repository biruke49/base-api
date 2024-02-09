const yup = require("yup");
const loginWithEmailSchema = yup.object({
  email: yup.string().email().min(8).max(132).required(),
  password: yup.string().min(4).max(32).required(),
});
module.exports = loginWithEmailSchema;
