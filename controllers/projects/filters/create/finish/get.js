// Finish project with specified id on query, set its status as waiting
// XMLHTTP request

const Project = require('../../../../../models/project/Project');
const Target = require('../../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findTargetById(req.query.id, (err, target) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }
    
    Project.findOneByFields({
      _id: target.project_id,
      creator: req.session.company._id
    }, {}, (err, project) => {
      if (err || !project) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      Target.finishTarget(req.query.id, err => {
        if (err) {
          res.write(JSON.stringify({ error: err, success: false }));
          return res.end();
        }; // Return error and success: false if there is an error
    
        res.write(JSON.stringify({ success: true }));
        return res.end(); // Return success: true
      });
    });
  });
}
