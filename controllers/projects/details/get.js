// Get project/details page with specified id on query

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findOneByFields({
    _id: req.query ? req.query.id : null,
    status: {$in: ['waiting', 'approved']}
  }, {
    timezone: req.session.company.timezone
  }, (err, project) => {
    if (err) return res.redirect('/');

    return res.render('projects/details', {
      page: 'projects/details',
      title: project.name,
      includes: {
        external: {
          css: ['page', 'general', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page']
        }
      },
      company: req.session.company,
      project
    });
  });
}
