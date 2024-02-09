const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { connectDB, createDefaultUser } = require("./config/config");
const userRouter = require("./api/routes/users-route");
const authRouter = require("./api/routes/auth-route");
const loggerRouter = require("./api/routes/activity-route");

var useragent = require("express-useragent");
const cookieParser = require("cookie-parser");
var cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const User = require("./models/users/User");
const Utility = require("./helpers/utility");
const ROLES = require("./helpers/roles");
const app = express();
app.disable("x-powered-by");
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(useragent.express());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/activity-logger", loggerRouter);

app.get("/api", (req, res) => {
  res.json({ message: `Welcome to My api.`, agent: req.useragent, i: req.ip });
});
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
connectDB();

createDefaultUser();

var cron = require("node-cron");
const Notification = require("./helpers/notification");
// Notification.getNearestDrivers()

cron.schedule("*/5 * * * *", async () => {
  // Notification.getNearestDrivers()
  const rideRequests = await RideRequest.find({
    status: RideRequestStatus.Scheduled,
  })
    .populate("passenger")
    .populate("driver");
  rideRequests.map((rideRequest) => {
    const date1 = new Date(rideRequest.date);
    const date2 = new Date();

    const diffMilliseconds = date1 - date2;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

    if (diffMinutes <= 5 && diffMinutes >= 0) {
      Notification.sendSingleNotification(
        rideRequests[0].passenger.fcm_id,
        {
          data: {},
          notification: {
            title: "Scheduled request",
            body: `${diffMinutes} minutes left for your next upcoming trip to ${rideRequest.drop_off_address}`,
          },
        },
        { priority: "high", timeToLive: 60 * 60 * 24 }
      );
      Notification.sendSingleNotification(
        rideRequests[0].driver.fcm_id,
        {
          data: {},
          notification: {
            title: "Scheduled request",
            body: `${diffMinutes} minutes left for your next upcoming trip to ${rideRequest.drop_off_address}`,
          },
        },
        { priority: "high", timeToLive: 60 * 60 * 24 }
      );
    }
  });
});

const server = http.createServer(app);
server.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Mongodb running on ${process.env.MONGO_URL}`);
});
