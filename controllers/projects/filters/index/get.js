// Get all filters of the given Project

const Project = require('../../../../models/project/Project');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findByProjectId(req.query ? req.query.id : null, (err, targets) => {
    if (err) return res.redirect('/projects');

    Project.findOneByFields({
      '_id': req.query.id
    }, {
      timezone: "Europe/Istanbul"
    }, (err, project) => {
      if (err) return res.redirect('/projects');

      return res.render('projects/filters/index', {
        page: 'projects/filters/index',
        title: project.name,
        includes: {
          external: {
            css: ['page', 'general', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
            js: ['page']
          }
        },
        company: req.session.company,
        targets,
        project
      });
    });
  });
}
