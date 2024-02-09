const User = require("../../models/users/User");
const Utility = require("../../helpers/utility");
const UserResponse = require("./user.response");
const {
  CollectionQuery,
  FilterOperators,
} = require("../../helpers/CollectionQuery");
const UserService = {
  GetUserById: async (id) => {
    try {
      return User.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  },
  GetUserByPhone: async (phoneNumber) => {
    try {
      return User.findOne({ phone_number: phoneNumber });
    } catch (error) {
      throw new Error(error);
    }
  },
  GetUsers: async (query) => {
    try {
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);

      const count = await User.count(filter);
      const users = await User.find(filter, select, options).populate(include);
      return {
        count: count,
        users: users.map((user) => new UserResponse(user)),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  GetUsersByRole: async (userType, query) => {
    try {
      if (!query.filter) {
        query.filter = [];
      }
      query.filter.push({
        field: "user_type",
        value: userType,
        operator: FilterOperators.EqualTo,
      });
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);

      const count = await User.count(filter);
      const users = await User.find(filter, select, options).populate(include);
      return {
        count: count,
        users: users.map((user) => new UserResponse(user)),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  CheckPhoneNumber: async (phoneNumber) => {
    try {
      return User.exists({ phone_number: phoneNumber });
    } catch (error) {
      throw new Error(error);
    }
  },
  CheckEmail: async (email) => {
    try {
      return User.exists({ email: email });
    } catch (error) {
      throw new Error(error);
    }
  },
  CreateUser: async (userAttribute) => {
    try {
      const address = userAttribute.address;
      const user = new User({
        first_name: userAttribute.first_name,
        last_name: userAttribute.last_name,
        email: userAttribute.email,
        gender: userAttribute.gender,
        phone_number: userAttribute.phone_number,
        password: Utility.hashPassword(userAttribute.password),
        created_by: userAttribute.created_by,
        user_type: userAttribute.user_type,
        role: userAttribute.roles,
        enabled: true,
        profile_image: "",
        emergency_contact: "",
        created_by: userAttribute.created_by,
        updated_by: userAttribute.updated_by,
      });
      user.address = address ? address : {};
      return user.save();
    } catch (err) {
      throw new Error(err);
    }
  },
  UpdatePassword: async (user, password) => {
    try {
      const hashedPassword = Utility.hashPassword(password);
      return user.updateOne({ password: hashedPassword });
    } catch (err) {
      throw new Error(err);
    }
  },
  ToModel: (user) => {
    try {
      return new UserResponse(user);
    } catch (error) {
      throw new Error(error);
    }
  },
  UpdateStatus: (userId, status, updated_by) => {
    try {
      return User.findByIdAndUpdate(
        userId,
        { enabled: status, updated_by: updated_by },
        { new: true }
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  UpdateUser: async (userId, newAttribute) => {
    try {
      const {
        address,
        first_name,
        last_name,
        email,
        phone_number,
        gender,
        roles,
        updated_by,
        emergency_contact,
      } = newAttribute;
      return User.findByIdAndUpdate(
        userId,
        {
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone_number: phone_number,
          gender: gender,
          address: address,
          role: roles,
          updated_by: updated_by,
          emergency_contact: emergency_contact,
        },
        { new: true }
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  UpdateProfileImage: async (userId, profileImage, updated_by) => {
    try {
      return User.findByIdAndUpdate(
        userId,
        { profile_image: profileImage, updated_by: updated_by },
        { new: true }
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  CountUsers: async (query) => {
    try {
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      return User.count(filter);
    } catch (err) {
      throw new Error(err);
    }
  },
  GroupAndCountUsers: async (query) => {
    try {
      const groupBy = query.groupBy;
      const { options, filter, include, select } =
        CollectionQuery.buildQuery(query);
      const docs = await User.aggregate([
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
};
module.exports = UserService;
