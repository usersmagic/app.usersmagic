// Create a new Target model

const Project = require('../../../../models/project/Project');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Project.findOneByFields({
    '_id': req.query ? req.query.project_id : null
  }, {
    timezone: "Europe/Istanbul"
  }, (err, project) => {
    if (err) return res.redirect('/projects');

    const data = req.body;
    data.project_id = project._id.toString();
    data.country = project.country;

    Target.createTarget(data, (err, target) => {
      if (err) return res.redirect('/projects');

      return res.redirect(`/projects/filters/create?id=${target._id.toString()}`);
    });
  });
}
