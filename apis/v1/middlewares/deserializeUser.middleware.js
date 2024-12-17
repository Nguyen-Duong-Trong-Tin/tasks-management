const jwtUtil = require('../../../utils/jwt.util');

const response401 = (res) => {
  return res.status(401).json({
    status: false,
    message: "You aren't login."
  });
}

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer") ||
      !authorization.split(" ")[1]
    ) {
      return response401(res);
    }

    const accessToken = authorization.split(" ")[1];
    const accessTokenVerify = jwtUtil.verify(accessToken);
    if (!accessTokenVerify.valid) {
      if (!accessTokenVerify.expire) {
        return response401(res);
      }

      const refreshToken = req.cookies.refresh_token;
      const refreshTokenVerify = jwtUtil.verify(refreshToken);
      if (!refreshTokenVerify.valid) {
        return response401(res);
      }

      res.clearCookie("refresh_token");
      return res.status(401).json({
        status: false,
        message: "Your access_token is expires."
      });
    }

    req.user = accessTokenVerify.data;
    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}