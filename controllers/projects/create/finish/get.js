// Finish project with specified id on query, set its status as waiting
// XMLHTTP request

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.finishProject(req.query ? req.query.id : null, req.session.company._id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }; // Return error and success: false if there is an error

    res.write(JSON.stringify({ success: true }));
    return res.end(); // Return success: true
  });
}
