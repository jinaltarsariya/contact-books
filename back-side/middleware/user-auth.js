const { error_res } = require("../library/general");
const jwt = require("jsonwebtoken");
const { doGetUser } = require("../model/user-model");

const userToken = async (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) {
      return res.json(error_res("Token is required!"));
    }

    jwt.verify(token, "USER-AUTHENTICATION", async (err, authData) => {
      if (err) {
        return res.json(error_res(err.message));
      } else {
        let doGetUserRes = await doGetUser(authData.id);
        if (doGetUserRes.flag !== 1) {
          return res.json(error_res("You are not authorised person!"));
        }
        req.user = doGetUserRes.data;
        next();
      }
    });
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

module.exports = { userToken };
