// Get project results index page

const json2csv = require('json-2-csv');

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.findSubmitionsByUserData(req.query, (err, submitions) => {
    if (err) return res.redirect('/');

    json2csv.json2csv(submitions, (err, csv) => {
      if (err) return res.redirect('/');

      return res.attachment('usersmagic report.csv').send(csv);
    });
  });
}