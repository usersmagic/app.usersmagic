// Get /admin/targets/details of the Target with the given id

const mongoose = require('mongoose');
const validator = require('validator');

const filterArrayToObject = require('../../../../models/target/functions/filterArrayToObject');

const Project = require('../../../../models/project/Project');
const Target = require('../../../../models/target/Target');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id.toString()))
    return res.redirect('/admin');

  Target.findById(mongoose.Types.ObjectId(req.query.id.toString()), (err, target) => {
    if (err || !target)
      return res.redirect('/admin');

    Project.findById(mongoose.Types.ObjectId(target.project_id), (err, project) => {
      if (err || !project)
        return res.redirect('/admin');

      Question.find({
        countries: target.country
      }, (err, questions) => {
        if (err) return res.redirect('/admin');

        filterArrayToObject(target.filters, (err, filters) => {
          if (err) return res.redirect('/admin');

          return res.render('admin/targets/details', {
            page: 'admin/targets/details',
            title: target.name,
            includes: {
              external: {
                css: ['admin', 'page', 'general']
              }
            },
            target,
            project,
            questions,
            filters
          });
        });
      });
    });
  });
}
