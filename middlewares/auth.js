const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

exports.auth = (req, res, next) => {

  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "You Must Send A Token To This Endpoint! " });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  }
  catch (err) {
    res.status(401).json({ err: "Token Is Invalid Or Expired." })
  }
}