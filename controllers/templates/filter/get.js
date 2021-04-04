// Get the Templates grouped by their title with the given filters on query
// XMLHTTP Request

const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Template.getTemplatesGroupedByTitle(req.query, (err, templates) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, templates: templates }));
    return res.end();
  });
}
