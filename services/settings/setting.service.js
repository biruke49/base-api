const Setting = require("../../models/setting/Setting");
const SettingResponse = require("./setting.response");
const SettingService = {
  GetSetting: async () => {
    try {
      return await Setting.findOne();
    } catch (err) {
      throw new Error(err);
    }
  },
  CreateSetting: async (settingAttribute) => {
    console.log(settingAttribute);
    try {
      await Setting.deleteMany();
      const setting = new Setting({
        radius: settingAttribute.radius,
        award_point: settingAttribute.award_point,
        last_updated_by: settingAttribute.last_updated_by,
      });
      return await setting.save();
    } catch (err) {
      throw new Error(err);
    }
  },
  ToModel: (setting) => {
    return new SettingResponse(setting);
  },
  UpdateSetting: async (setting, newAttribute) => {
    try {
      const radius = newAttribute.radius ? newAttribute.radius : setting.radius;

      const award_point = newAttribute.award_point
        ? newAttribute.award_point
        : setting.award_point;
      const last_updated_by = newAttribute.last_updated_by
        ? newAttribute.last_updated_by
        : setting.last_updated_by;
      return await Setting.findByIdAndUpdate(
        setting._id,
        {
          last_updated_by: last_updated_by,
          radius: radius,
          award_point: award_point,
        },
        { new: true, upsert: true }
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
module.exports = SettingService;
