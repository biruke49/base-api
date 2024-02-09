const Category = require("../../models/categories/Category");
const User = require("../../models/users/User");
const UserResponse = require("../users/user.response");
const VehicleSummaryResponse = require("../vehicles/vehicle.summary.response");

class CategoryResponse {
  constructor(category) {
    if (category instanceof Category) {
      this.id = category._id;
      this.name = category.name;
      this.discount = category.discount;
      this.per_kilometer_cost = category.per_kilometer_cost;
      this.per_minute_cost = category.per_minute_cost;
      this.capacity = category.capacity;
      if (category.updated_by instanceof User) {
        this.updated_by = new UserResponse(category.updated_by);
      } else {
        this.updated_by_id = category.updated_by;
      }
      if (category.created_by instanceof User) {
        this.created_by = new UserResponse(category.created_by);
      } else {
        this.created_by_id = category.created_by;
      }
      if (category.vehicles && Array.isArray(category.vehicles)) {
        this.vehicles = category.vehicles.map(
          (c) => new VehicleSummaryResponse(c)
        );
      }
      this.type = category.type;
      this.is_active = category.is_active;
      this.initial_fare = category.initial_fare;
      this.commission = category.commission;
      this.icon = category.icon ? category.icon : "";
      this.description = category.description;
      this.created_at = category.createdAt;
      this.updated_at = category.updatedAt;
    }
  }
}
module.exports = CategoryResponse;
