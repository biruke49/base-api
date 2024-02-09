const express = require("express");
const route = express.Router();
const Authenticate = require("../middleware/authenticate");
const ActivityLoggerController = require("../controllers/ActivityLoggerController");
route.get(
  "/get-activity-logger/:id",
  [Authenticate],
  ActivityLoggerController.GetActivityLogger
);
route.get(
  "/get-activity-logs",
  [Authenticate],
  ActivityLoggerController.GetActivityLoggers
);
route.get(
  "/get-user-activities?user_id",
  [Authenticate],
  ActivityLoggerController.GetUserActivityLog
);
route.get(
  "/get-model-activities?model_name",
  [Authenticate],
  ActivityLoggerController.GetModelActivityLogger
);
route.get(
  "/get-my-activities",
  [Authenticate],
  ActivityLoggerController.GetMyActivityLog
);

module.exports = route;
