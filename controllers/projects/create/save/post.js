// Update project information
// XMLHTTP request

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.updateProject(req.query ? req.query.id : null, req.body, err => {
    if (err) return res.json({ error: err, success: false });

    Project.saveQuestions(req.query ? req.query.id : null, req.body.questions, err => {
      if (err) return res.json({ error: err, success: false });

      return res.json({ success: true });
    });
  });
}
