// Giả sử bạn đã có middleware xác thực người dùng
module.exports = function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Forbidden. Admins only." });
};
