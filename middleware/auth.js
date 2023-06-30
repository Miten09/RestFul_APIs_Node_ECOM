const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res
      .status(200)
      .send({ success: false, msg: "A token is required for authentication" });
  }
  try {
    const decode = jwt.verify(token, config.secret_jwt);
    req.user = decode;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = verifyToken;
