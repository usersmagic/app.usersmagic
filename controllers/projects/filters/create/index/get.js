// Get projects/filters/create page with specified id on query

const Project = require('../../../../../models/project/Project');
const Target = require('../../../../../models/target/Target');
const Question = require('../../../../../models/question/Question');

module.exports = (req, res) => {
  Target.findOneByFields({
    _id: req.query ? req.query.id : null
  }, {}, (err, target) => {
    if (err) return res.redirect('/projects');

    Project.findOneByFields({
      _id: target.project_id
    }, {}, (err, project) => {
      if (err) return res.redirect('/projects');

      Question.find({
        country: target.country,
        $or: [
          {type: 'radio'},
          {type: 'checked'},
          {type: 'range'}
        ]
      }, (err, filters) => {
        if (err) return res.redirect('/projects');

        target.filters = {
          'age': {
            min: 20,
            max: 30
          },
          '5f390b0d0fe56c13ca4e46fd': ['2', '5', '6'],
          '5f390cc6a629311426949918': ['Evet']
        }
  
        return res.render('projects/filters/create', {
          page: 'projects/filters/create',
          title: project.name,
          includes: {
            external: {
              css: ['page', 'general', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
              js: ['page', 'buttonListeners']
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
