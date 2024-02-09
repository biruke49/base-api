const User = require("../../models/users/User");
const UserResponse = require("../../services/users/user.response");
class SettingResponse {
  constructor(setting) {
    this.award_point = setting.award_point ? setting.award_point : null;
    if (setting.last_updated_by instanceof User) {
      this.last_updated_by = new UserResponse(setting.last_updated_by);
    } else {
      this.last_updated_by_id = setting.last_updated_by;
    }
    this.borrow_limit = setting.borrow_limit;
    this.radius = setting.radius;
    this.created_at = setting.createdAt;
    this.updated_at = setting.updatedAt;
  }
}
module.exports = SettingResponse;
