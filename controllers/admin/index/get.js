// Get /admin page

module.exports = (req, res) => {
  return res.render('admin/index/index', {
    page: 'admin/index/index',
    title: 'Admin',
    includes: {
      external: {
        css: ['admin', 'page', 'general']
      }
    }
  });
};
