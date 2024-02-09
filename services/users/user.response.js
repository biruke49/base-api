const User = require("../../models/users/User");

class UserResponse {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.phone_number = user.phone_number;
    this.gender = user.gender;
    this.roles = user.role;
    this.user_type = user.user_type;
    this.address = user.address;
    this.created_at = user.createdAt;
    this.updated_at = user.updatedAt;
    this.enabled = user.enabled;
    this.profile_image = user.profile_image;
    this.emergency_contact = user.emergency_contact;
    if (user.updated_by instanceof User) {
      this.updated_by = new UserResponse(user.updated_by);
    } else {
      this.updated_by_id = user.updated_by;
    }
    if (user.created_by instanceof User) {
      this.created_by = new UserResponse(user.created_by);
    } else {
      this.created_by_id = user.created_by;
    }
  }
}
module.exports = UserResponse;
