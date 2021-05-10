// Save new company data
// XMLHTTP Request

const Company = require('../../models/company/Company');

module.exports = (req, res) => {
  Company.updateCompany(req.session.company._id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
