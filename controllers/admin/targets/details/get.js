// Get /admin/targets/details of the Target with the given id

const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findOneByFields({ _id: req.query ? req.query.id : null }, (err, target) => {
    if (err) return res.redirect('/admin/targets');

    return res.render('admin/targets/details', {
      page: 'admin/targets/details',
      title: target.name,
      includes: {
        external: {
          css: ['admin', 'page', 'general']
        }
      }
    });
  });
}
