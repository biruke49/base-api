const Session = require("../../models/sessions/Session");
const SessionService = {
  GetSessionById: async (id) => {
    return Session.findById(id);
  },
  GetSessions: async () => {
    try {
      return await Session.find();
    } catch (err) {
      //console.log(err)
      throw new Error(err);
    }
  },
  RemoveSession: async (userId) => {
    try {
      return await Session.deleteMany({ user_id: userId });
    } catch (err) {
      throw new Error(err);
    }
  },
  GetUserSession: async (userId) => {
    try {
      return await Session.findOne({ user_id: userId });
    } catch (err) {
      throw new Error(err);
    }
  },
  UpdateUserSession: async (userId, sessionAttribute) => {
    try {
      const filter = { user_id: userId };
      const update = {
        ip_address: sessionAttribute.ip_address,
        user_agent: sessionAttribute.user_agent,
        token: sessionAttribute.token,
        refresh_token: sessionAttribute.refresh_token,
      };
      return await Session.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
module.exports = SessionService;
