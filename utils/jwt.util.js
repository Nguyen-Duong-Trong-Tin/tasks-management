const jwt = require("jsonwebtoken");

const generateToken = (data, expiresIn) => {
  return jwt.sign(
    data,
    process.env.TOKEN_SECRET,
    { expiresIn: expiresIn }
  );
}

const verify = (token) => {
  const result = {
    valid: false,
    expire: false,
    data: {}
  };
  
  jwt.verify(token, process.env.TOKEN_SECRET, (e, data) => {
    if (e) {
      result.expire = e.name === "TokenExpiredError";
      return;
    }

    result.valid = true;
    result.data = data;
  });

  return result;
}

const jwtUtil = {
  generateToken,
  verify
};
module.exports = jwtUtil;