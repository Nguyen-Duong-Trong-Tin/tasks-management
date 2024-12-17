module.exports = (array) => (req, res, next) => {
  const role = req.user.role;
  console.log(role);
  
  if (!array.includes(role)) {
    return res.status(403).json({
      status: false,
      message: "You aren't allowed."
    });
  }

  return next();
}