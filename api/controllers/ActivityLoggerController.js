const ActivityLoggerService = require("../../services/activity_logger/ActivityLogger.service");
const ActivityLoggerController = {
  GetActivityLogger: async (req, res) => {
    try {
      const id = req.params.id;
      const log = await ActivityLoggerService.GetActivityLoggerById(id);
      res.status(200).json(log);
    } catch (err) {
      res.status(400).json("Unable to process your request, Please try again");
    }
  },
  GetActivityLoggers: async (req, res) => {
    try {
      const { count, logs } = await ActivityLoggerService.GetActivityLoggers(
        req.query
      );
      res.status(200).json({ total: count, items: logs });
    } catch (err) {
      res.status(400).json("Unable to process your request, Please try again");
    }
  },
  GetUserActivityLog: async (req, res) => {
    try {
      const { user_id } = req.query.user_id;
      if (user_id) {
        const { count, logs } = await ActivityLoggerService.GetUserActivity(
          user_id,
          req.query
        );
        res.status(200).json({ total: count, items: logs });
      } else {
        res.status(400).json("Cannot load user activity, user_id is required");
      }
    } catch (err) {
      res.status(500).json("Unable to process your request, Please try again");
    }
  },
  GetMyActivityLog: async (req, res) => {
    try {
      const user_id = res.jwtPayload.userId;
      if (user_id) {
        const { count, logs } = await ActivityLoggerService.GetUserActivity(
          user_id,
          req.query
        );
        res.status(200).json({ total: count, items: logs });
      } else {
        res.status(400).json("Cannot load user activity, user_id is required");
      }
    } catch (err) {
      res.status(500).json("Unable to process your request, Please try again");
    }
  },
  GetModelActivityLogger: async (req, res) => {
    try {
      const { model_name } = req.query.model_name;
      const { count, logs } =
        await ActivityLoggerService.GetActivityLoggerByModel(
          model_name,
          req.query
        );
      res.status(200).json({ total: count, items: logs });
    } catch (err) {
      res.status(400).json("Unable to process your request, Please try again");
    }
  },
};
module.exports = ActivityLoggerController;
