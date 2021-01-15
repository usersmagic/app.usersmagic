// Check if there is admin field in session to see if admin login is complete or not

module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.redirect('/admin/auth');
  };
};
