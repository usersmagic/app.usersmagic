const fetch = require('node-fetch');

module.exports = (body, callback) => {
  const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

  if (!body || !body.template || !body.to) return callback('bad_request');

  if (body.template == 'invite_user_app_en' || body.template == 'invite_user_app_tr') {
    if (!body.email || !body.name || !body.company_name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=${body.template}&merge_name=${body.name}&merge_email=${body.email}&merge_company_name=${body.company_name}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('email_submition'));
  } else {
    return callback('bad_request');
  }
};
