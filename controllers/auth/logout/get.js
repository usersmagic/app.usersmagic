// Deletes session completely, redirects to login page

module.exports = (req, res) => {
  req.session.company = null;
  req.session.destroy();
  return res.redirect('/auth/login');
}
