// Change status of the target with the given id, update its status

const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.updateTargetStatus(req.query ? req.query.id : null, req.body, err => {
    if (err) return res.redirect('/admin');

    return res.redirect('/admin/targets');
  });
}
