// Get project object for client side with specified options

const moment = require('moment-timezone');

module.exports = (project, options, callback) => {
  if (!project || !project._id)
    return callback('document_not_found');

  let timezone = 'Etc/Greenwich';

  if ((options && options.timezone)) {
    if (!moment.tz.zone(options.timezone))
      return callback('bad_request');

    timezone = options.timezone;
  }

  return callback(null, {
    _id: project._id.toString(),
    type: project.type,
    status: project.status,
    created_at: moment(project.created_at).tz(timezone).format('DD[.]MM[.]YYYY[, ]HH[:]mm'),
    name: project.name,
    description: project.description,
    description_updated: project.description_updated,
    image: project.image,
    image_updated: project.image_updated,
    questions: project.questions,
    questions_updated : project.questions_updated,
    welcome_screen: project.welcome_screen ? {
      opening: project.welcome_screen.opening,
      details: project.welcome_screen.details,
      image: project.welcome_screen.image
    } : {},
    welcome_screen_updated: project.welcome_screen_updated ? {
      opening: project.welcome_screen_updated.opening,
      details: project.welcome_screen_updated.details,
      image: project.welcome_screen_updated.image
    } : {}
  });
}
