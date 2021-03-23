// Get /admin/countries/details page using the id field on req.query

const Country = require('../../../../models/country/Country');

module.exports = (req, res) => {
  Country.getCountryById(req.query, (err, country) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/countries/details', {
      page: 'admin/countries/details',
      title: country.name,
      includes: {
        external: {
          css: ['page', 'admin', 'general'],
          js: ['page']
        }
      },
      country
    });
  });
}
