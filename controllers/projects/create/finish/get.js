// Finish project with specified id on query, set its status as waiting
// XMLHTTP request

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.finishProject(req.query ? req.query.id : null, err => {
    if (err) return res.json({ error: err, success: false }); // Return error and success: false if there is an error

    return res.json({ success: true }); // Return success: true
  });
}
