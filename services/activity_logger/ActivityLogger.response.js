const ActivityLogger = require("../../models/activity_logger/ActivityLogger.model");
class ActivityLoggerResponse {
  constructor(log) {
    if (log instanceof ActivityLogger) {
      this.id = log._id;
      this.model = log.model;
      this.operation = log.operation;
      this.old = log.old;
      this.payload = log.payload;
      this.author = log.author;
      this.created_at = log.createdAt;
      this.updated_at = log.updatedAt;
    }
  }
}
module.exports = ActivityLoggerResponse;
