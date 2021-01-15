// Get projects index page

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findByFields({
    creator: req.session.company._id
  }, {
    timezone: req.session.company.timezone
  }, (err, projects) => {
    if (err) return res.redirect('/auth/login');

    return res.render('projects/index/index', {
      page: 'projects/index/index',
      title: 'Projects',
      includes: {
        external: {
          css: ['page', 'general', 'header', 'confirm', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
          js: ['page', 'confirm']
        }
      },
      projects,
      company: req.session.company
    });
  });
}
