const Category = require("../../models/categories/Category");
class CategorySummaryResponse {
  constructor(category) {
    if (category instanceof Category) {
      this.id = category._id;
      this.name = category.name;
      this.discount = category.discount;
      this.per_kilometer_cost = category.per_kilometer_cost;
      this.per_minute_cost = category.per_minute_cost;
      this.type = category.type;
      this.capacity = category.capacity;
      this.initial_fare = category.initial_fare;
      this.commission = category.commission;
      this.icon = category.icon ? category.icon : "";
      this.description = category.description;
      this.created_at = category.createdAt;
      this.updated_at = category.updatedAt;
      this.created_by_id = category.created_by;
      this.updated_by_id = category.updated_by;
    }
  }
}
module.exports = CategorySummaryResponse;
