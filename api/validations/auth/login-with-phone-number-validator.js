const yup = require("yup");
const loginWithPhoneNumberSchema = yup.object({
  phone_number: yup.string().min(10).max(15).required(),
  password: yup.string().min(4).max(32).required(),
});
module.exports = loginWithPhoneNumberSchema;
