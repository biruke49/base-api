const express = require("express");
const route = express.Router();
const Authenticate = require("../middleware/authenticate");
const Authorize = require("../middleware/authorize");
const UserController = require("../controllers/UserController");
const Validator = require("../middleware/validator");
const createUserSchema = require("../validations/user/create-user-validator");

const roles = require("../../helpers/roles");
route.post(
  "/create-user",
  [
    Authenticate,
    Authorize([roles.Admin, roles.SuperAdmin]),
    Validator(createUserSchema),
  ],
  UserController.CreateUser
);
route.get("/get-user/:id", [Authenticate], UserController.GetUser);
route.get(
  "/get-users",
  [Authenticate, Authorize([roles.Admin, roles.Operator, roles.SuperAdmin])],
  UserController.GetUsers
);
route.get("/profile", [Authenticate], UserController.GetCurrentUser);
route.get("/check-phone-number", UserController.CheckPhoneNumber);
route.get("/check-email", UserController.CheckEmail);
route.post(
  "/change-password",
  [
    Authenticate,
    Authorize([
      roles.Admin,
      roles.Operator,
      roles.SuperAdmin,
      roles.FinanceOfficer,
    ]),
  ],
  UserController.ChangePassword
);

route.post(
  "/activate-user",
  [Authenticate, Authorize([roles.Admin, roles.Operator, roles.SuperAdmin])],
  UserController.ActivateUser
);
route.post(
  "/block-user",
  [Authenticate, Authorize([roles.Admin, roles.Operator, roles.SuperAdmin])],
  UserController.BlockUser
);

route.post("/update-profile", [Authenticate], UserController.UpdateProfile);
route.post(
  "/update-user",
  [Authenticate, Validator(createUserSchema)],
  UserController.UpdateUser
);

route.post(
  "/update-profile-image",
  [Authenticate],
  UserController.UpdateUserImage
);
route.get("/count-users", [Authenticate], UserController.CountUsers);
route.get("/group-users", [Authenticate], UserController.GroupAndCountUsers);
module.exports = route;
