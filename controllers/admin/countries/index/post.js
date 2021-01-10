// Create a new Country document

const Country = require('../../../../models/country/Country');

module.exports = (req, res) => {
  Country.createCountry(req.body, (err, country) => {
    if (err) return res.redirect('/admin');

    return res.redirect('/admin/countries');
  });
}
