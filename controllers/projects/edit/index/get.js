const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findOneByFields({
    _id: req.query ? req.query.id : null,
    status : 'waiting'
  }, {
    timezone: req.session.company.timezone
  }, (err, project) =>{
    if(err) return res.redirect('/');

    return res.render('projects/edit/index', {
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
