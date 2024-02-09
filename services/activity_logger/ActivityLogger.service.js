const {
  CollectionQuery,
  FilterOperators,
} = require("../../helpers/CollectionQuery");
const ActivityLogger = require("../../models/activity_logger/ActivityLogger.model");
const ActivityLoggerResponse = require("../../services/activity_logger/ActivityLogger.response");
const ActivityLoggerService = {
  GetActivityLoggerById: async (id) => {
    return ActivityLogger.findById(id);
  },
  GetActivityLoggerByModel: async (modelName, query) => {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push({
      field: "model.name",
      value: modelName,
      operator: FilterOperators.EqualTo,
    });
    const { options, filter, include, select } =
      CollectionQuery.buildQuery(query);
    const count = await ActivityLogger.count(filter);
    const logs = await ActivityLogger.find(filter, select, options).populate(
      include
    );
    return {
      count: count,
      logs: logs.map((log) => new ActivityLoggerResponse(log)),
    };
  },
  GetActivityLoggers: async (query) => {
    try {
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const count = await ActivityLogger.count(filter);
      const logs = await ActivityLogger.find(filter, select, options).populate(
        include
      );
      return {
        count: count,
        logs: logs.map((log) => new ActivityLoggerResponse(log)),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  CreateLogger: async (logAttribute) => {
    try {
      const logger = new ActivityLogger({
        model: logAttribute.model,
        operation: logAttribute.operation,
        old: logAttribute.old,
        payload: logAttribute.payload,
        author: logAttribute.author,
      });
      return logger.save();
    } catch (err) {
      throw new Error(err);
    }
  },
  ToModel: (log) => {
    return new ActivityLoggerResponse(log);
  },
  GetUserActivity: async (userId, query) => {
    try {
      if (!query.filter) {
        query.filter = [];
      }
      query.filter.push({
        field: "author.id",
        value: userId,
        operator: FilterOperators.EqualTo,
      });
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const count = await ActivityLogger.count(filter);
      const logs = await ActivityLogger.find(filter, select, options).populate(
        include
      );
      return {
        count: count,
        logs: logs.map((log) => new ActivityLoggerResponse(log)),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};
module.exports = ActivityLoggerService;
