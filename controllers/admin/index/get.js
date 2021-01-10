// Get /admin page

module.exports = (req, res) => {
  return res.render('admin/index', {
    page: 'admin/index',
    title: 'Admin',
    includes: {
      external: {
        css: ['admin', 'page', 'general']
      }
    }
  });
};
