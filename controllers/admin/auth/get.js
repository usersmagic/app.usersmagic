module.exports = (req, res) => {
  res.render('admin/auth', {
    page: 'admin/auth',
    title: 'Admin Login',
    includes: {
      external: {
        css: ['page', 'general', 'logo', 'inputs', 'buttons', 'fontawesome']
      }
    }
  });
};
