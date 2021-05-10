// Get project/details page with specified id on query

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findOneByFields({
    _id: req.query.id,
    status: {$in: ['finished', 'waiting']},
    creator: req.session.company._id.toString()
  }, {
    timezone: req.session.company.timezone
  }, (err, project) => {
    if (err) return res.redirect('/');

    return res.render('projects/details/index', {
      page: 'projects/details/index',
      title: project.name,
      includes: {
        external: {
          css: ['page', 'general', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page', 'headerListeners']
        }
      },
      company: req.session.company,
      project
    });
  });
}
