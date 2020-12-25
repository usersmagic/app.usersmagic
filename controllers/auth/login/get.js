module.exports = (req, res) => {
  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }

  return res.render('auth/login', {
    page: 'auth/login',
    title: 'Giriş Yap',
    includes: {
      external: ['css', 'fontawesome']
    },
    error
  });
}
