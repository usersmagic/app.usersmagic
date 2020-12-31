// Get project/create page with specified id on query

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findOneByFields({
    _id: req.query ? req.query.id : null
  }, {
    timezone: req.session.company.timezone
  }, (err, project) => {
    if (err) return res.redirect('/');

    return res.render('projects/create', {
      page: 'projects/create',
      title: project.name,
      includes: {
        external: {
          css: ['page', 'general', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page', 'duplicateElement', 'dragAndDrop', 'buttonListeners']
        }
      },
      company: req.session.company,
      project
    });
  });
}
