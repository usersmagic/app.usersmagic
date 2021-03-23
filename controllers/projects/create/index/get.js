// Get projects/create page with specified id on query

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findOneByFields({
    _id: req.query ? req.query.id : null,
    status: 'saved'
  }, {
    timezone: req.session.company.timezone
  }, (err, project) => {
    if (err) return res.redirect('/');

    return res.render('projects/create/index', {
      page: 'projects/create/index',
      title: project.name,
      includes: {
        external: {
          css: ['page', 'general', 'header', 'confirm', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page', 'duplicateElement', 'confirm', 'dragAndDrop', 'buttonListeners', 'headerListeners']
        }
      },
      company: req.session.company,
      project
    });
  });
}
