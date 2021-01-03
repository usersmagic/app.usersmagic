// Checks if the given array is valid as a filter query, returns an array of filters

const async = require('async');
const validator = require('validator');

const getFilter = (filter, callback) => {
  // Takes an object, returns its mongodb search query version recursively

  if (!filter || typeof filter !== 'object')
    return callback('bad_request');

  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (!key || !value)
    return callback('bad_request');

  if (key == 'and' || key == 'or') {
    if (!Array.isArray(value))
      return callback('bad_request');

    async.timesSeries(
      value.length,
      (time, next) => getFilter(value[time], (err, filter) => next(err, filter) ),
      (err, filters) => {
        if (err) return callback(err);

        return callback(null, {
          [key]: filters
        });
      }
    );
  } else {
    return callback(null, {
      [key]: value
    });
  }
}

module.exports = (filters, callback) => {
  if (!filters || !Array.isArray(filters))
    return callback('bad_request');

  async.timesSeries(
    filters.length,
    (time, next) => {
      const filter = filters[time];

      if (!filter || typeof filter !== 'object')
        return next('bad_request');

      return getFilter(filter, (err, filter) => next(err, filter));
    },
    (err, filters) => {
      if (err) return callback(err);

      return callback(null, filters);
    }
  );
}
