const Country = require('../../country/Country');

module.exports = (company, callback) => {
  if (!company || !company._id)
    return callback('document_not_found');

  const company_data = {
    _id: company._id.toString(),
    name: company.name,
    country: '',
    country_name: '',
    profile_photo: company.profile_photo,
    phone_number: company.phone_number,
    teams: company.teams,
    credit: company.credit,
    plan: company.plan
  };

  Country.getCountryWithAlpha2Code(company.country, (err, country) => {
    if (err || !country) return callback(err || 'bad_request');

    company_data.country = company.country;
    company_data.country_name = country.name;

    return callback(null, company_data);
  });
}
