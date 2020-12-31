// Create a new project

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  const data = req.body || {};
  data.creator = req.session.company._id;
  data.type = 'survey';

  console.log(data);
  Project.createProject(data, (err, project) => {
    console.log(err);
    if (err) return res.redirect('/');

    return res.redirect(`/projects/create?id=${project._id}`);
  });
}
