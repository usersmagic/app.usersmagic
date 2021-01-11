// Get /admin/countries page

const Country = require('../../../../models/country/Country');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/countries/index', {
      page: 'admin/countries/index',
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
