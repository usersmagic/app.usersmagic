// Get /admin/targets page, finds and returns Target document with the status: waiting

const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findByFields({
    status: 'waiting'
  }, {}, (err, targets) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/targets/index', {
      page: 'admin/targets/index',
      title: 'Özel Projeler',
      includes: {
        external: {
          css: ['admin', 'page', 'general']
        }
      },
      targets
    });
  });
}
