const Authorize = (roles) => {
  return async (req, res, next) => {
    try {
      const userRoles = res.jwtPayload.role;
      //Check if array of authorized roles includes the user's role
      let authorized = false;
      for (let r of userRoles) {
        if (roles.indexOf(r) > -1) {
          authorized = true;
          break;
        }
      }
      if (authorized) {
        next();
      } else {
        res.status(401).send();
        return;
      }
    } catch (error) {
      res.status(401).send();
      return;
    }
  };
};
module.exports = Authorize;
