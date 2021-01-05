// Get projects/filters/create page with specified id on query

const Project = require('../../../../../models/project/Project');
const Target = require('../../../../../models/target/Target');
const Question = require('../../../../../models/question/Question');

module.exports = (req, res) => {
  Target.findOneByFields({
    _id: req.query ? req.query.id : null
  }, {}, (err, target) => {
    if (err) return res.redirect('/projects');

    if (target.status != 'saved')
      return res.redirect(`/projects/filters?id=${target.project_id}`);

    Project.findOneByFields({
      _id: target.project_id
    }, {}, (err, project) => {
      if (err) return res.redirect(`/projects/filters?id=${target.project_id}`);

      Question.getFiltersByCountry(target.country, (err, filters) => {
        if (err) return res.redirect(`/projects/filters?id=${target.project_id}`);

        return res.render('projects/filters/create', {
          page: 'projects/filters/create',
          title: project.name,
          includes: {
            external: {
              css: ['page', 'general', 'header', 'confirm', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
              js: ['page', 'buttonListeners', 'confirm']
            }
          },
          company: req.session.company,
          target,
          project,
          filters
        });
      });
    });
  });
}
