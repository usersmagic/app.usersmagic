module.exports = (req, res) => {
  res.render('admin/auth/index', {
    page: 'admin/auth/index',
    title: 'Admin Login',
    includes: {
      external: {
        css: ['page', 'general', 'logo', 'inputs', 'buttons', 'fontawesome']
      }
    }
  });
};
