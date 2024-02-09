const {
  CollectionQuery,
  FilterOperators,
} = require("../../helpers/CollectionQuery");
const Category = require("../../models/categories/Category");
const ProviderService = require("../vehicles/vehicle.service");
const CategoryResponse = require("./category.response");
const CategoryService = {
  GetCategoryById: async (id) => {
    return Category.findById(id).populate("vehicles created_by updated_by");
  },
  GetCategory: async (id) => {
    return Category.findById(id);
  },
  GetCategories: async (query) => {
    try {
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const count = await Category.count(filter);
      const categories = await Category.find(filter, select, options).populate(
        include
      );
      return {
        count: count,
        categories: categories.map(
          (category) => new CategoryResponse(category)
        ),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  CountCategories: async (query) => {
    try {
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const count = await Category.count(filter);
      return count;
    } catch (err) {
      throw new Error(err);
    }
  },
  GroupAndCountCategories: async (query) => {
    try {
      const groupBy = query.groupBy;
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const docs = await Category.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$" + groupBy,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            [groupBy]: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
      return docs;
    } catch (err) {
      throw new Error(err);
    }
  },
  GetCategoriesByType: async (type, query) => {
    try {
      if (!query.filter) {
        query.filter = [];
      }
      query.filter.push({
        field: "type",
        value: type,
        operator: FilterOperators.EqualTo,
      });
      query.filter.push({
        field: "is_active",
        value: true,
        operator: FilterOperators.EqualTo,
      });
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const count = await Category.count(filter);
      const categories = await Category.find(filter, select, options).populate(
        include
      );
      return {
        count: count,
        categories: categories.map(
          (category) => new CategoryResponse(category)
        ),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  CreateCategory: async (categoryAttribute) => {
    try {
      let category = new Category({
        name: categoryAttribute.name,
        discount: categoryAttribute.discount,
        created_by: categoryAttribute.created_by,
        updated_by: categoryAttribute.created_by,
        commission: categoryAttribute.commission,
        capacity: categoryAttribute.capacity,
        type: categoryAttribute.type,
        icon: categoryAttribute.icon,
        per_kilometer_cost: categoryAttribute.per_kilometer_cost,
        per_minute_cost: categoryAttribute.per_minute_cost,
        initial_fare: categoryAttribute.initial_fare,
        description: categoryAttribute.description,
      });
      return category.save();
    } catch (err) {
      throw new Error(err);
    }
  },
  UpdateCategory: async (newAttribute) => {
    try {
      const {
        id,
        name,
        discount,
        updated_by,
        commission,
        type,
        icon,
        per_kilometer_cost,
        initial_fare,
        description,
        per_minute_cost,
        capacity,
      } = newAttribute;
      const value = {
        name: name,
        discount: discount,
        updated_by: updated_by,
        commission: commission,
        type: type,
        icon: icon,
        per_kilometer_cost: per_kilometer_cost,
        initial_fare: initial_fare,
        description: description,
        per_minute_cost: per_minute_cost,
        capacity: capacity,
      };
      return await Category.findOneAndUpdate({ _id: id }, value, { new: true });
    } catch (err) {
      throw new Error(err);
    }
  },
  ToModel: (category) => {
    return new CategoryResponse(category);
  },
  DeleteCategory: async (id) => {
    try {
      return await Category.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err);
    }
  },
  ActivateCategory: async (categoryId, updatedBy) => {
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { is_active: true, updated_by: updatedBy },
        { new: true }
      );
      await ProviderService.ActivateVehicleByCategoryId(categoryId, updatedBy);
      return new CategoryResponse(category);
    } catch (error) {
      throw new Error(error);
    }
  },
  BlockCategory: async (categoryId, updatedBy) => {
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { is_active: false, updated_by: updatedBy },
        { new: true }
      );
      await ProviderService.BlockVehicleByCategoryId(categoryId, updatedBy);
      return new CategoryResponse(category);
    } catch (error) {
      throw new Error(error);
    }
  },
};
module.exports = CategoryService;
