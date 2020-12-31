// Get projects index page

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findByFields({
    creator: req.session.company._id
  }, {
    timezone: "Europe/Istanbul"
  }, (err, projects) => {
    if (err) return res.redirect('/auth/login');

    return res.render('projects/index', {
      page: 'projects/index',
      title: 'Projects',
      includes: {
        external: {
          css: ['page', 'general', 'header', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
          js: ['page']
        }
      },
      projects,
      company: req.session.company
    });
  });
}
