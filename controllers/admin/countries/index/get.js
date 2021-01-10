// Get /admin/countries page

const Country = require('../../../../models/country/Country');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/countries', {
      page: 'admin/countries',
      title: 'Ülkeler',
      includes: {
        external: {
          css: ['page', 'admin', 'general'],
          js: ['page']
        }
      },
      countries
    });
  });
}
