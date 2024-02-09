const yup = require("yup");
const createUserSchema = yup.object({
  first_name: yup.string().min(1).max(25).required(),
  last_name: yup.string().min(1).max(25).required(),
  email: yup.string().email().min(5).max(132).required(),
  phone_number: yup.string().min(10).max(15).required(),
  gender: yup.mixed().oneOf(["Male", "Female"]),
  roles: yup.array().required(),
});
module.exports = createUserSchema;
