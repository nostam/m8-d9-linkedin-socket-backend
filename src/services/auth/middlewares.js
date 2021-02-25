const { verifyJWT } = require("./index");
const UserModel = require("../../models/profiles");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = await verifyJWT(token);

    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    const err = new Error("Authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

module.exports = { authorize };
