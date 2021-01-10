const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  alpha2_code: {
    type: String,
    unique: true,
    length: 2
  },
  cities: {
    type: Array,
    default: []
  }
});

CountrySchema.statics.createCountry = function (data, callback) {
  // Create a country object and returns it or an error if it exists

  if (!data || !data.name || !data.name.length || !data.alpha2_code || data.alpha2_code.length != 2)
    return callback('bad_request');

  const Country = this;

  const newCountryData = {
    name: data.name,
    alpha2_code: data.alpha2_code
  }

  const newCountry = new Country(newCountryData);

  newCountry.save((err, country) => {
    if (err && err.code == 11000)
      return callback('duplicated_unique_field');
    if (err)
      return callback(err);

    return callback(null, country);
  });
}

CountrySchema.statics.getCountries = function (callback) {
  // Finds and returns all countries sorted by their name

  const Country = this;

  Country
    .find({})
    .sort({ name: -1 })
    .then(countries => {
      return callback(null, countries);
    })
    .catch(err => {
      return callback(err);
    });
}

module.exports = mongoose.model('Country', CountrySchema);
