// Get target object for client side with specified options

const moment = require('moment-timezone');

const Country = require('../../country/Country');

module.exports = (target, options, callback) => {
  if (!target || !target._id)
    return callback('document_not_found');

  let timezone;

  if ((options && options.timezone)) {
    if (!moment.tz.zone(options.timezone))
      return callback('bad_request');

    timezone = options.timezone;
  }

  Country.getCountryWithAlpha2Code(target.country, (err, country) => {
    if (err) return callback(err);

    return callback(null, {
      _id: target._id.toString(),
      filters: options.filters ? options.filters : {},
      status: target.status,
      project_id: target.project_id,
      created_at: timezone ? moment(target.created_at).tz(timezone).format('DD[.]MM[.]YYYY[, ]HH[:]mm') : target.created_at,
      name: target.name,
      description: target.description,
      country: target.country,
      submition_limit: target.submition_limit,
      credit_per_user: country.credit_per_user,
      approved_submition_count: target.approved_submition_count || 0
    });
  });
}
