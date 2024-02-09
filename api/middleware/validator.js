const Validator = (schema) => {
  // console.log("validating schema")
  return async (req, res, next) => {
    try {
      const inputs = req.body;
      await schema.validate(inputs);
      next();
    } catch (error) {
      res.status(400).json(error);
      return;
    }
  };
};
module.exports = Validator;
