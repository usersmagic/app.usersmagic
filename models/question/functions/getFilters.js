// Takes an array of questions and returns them as a filter array for client side

const async = require('async');

module.exports = (questions, callback) => {
  if (!questions || !Array.isArray(questions))
    return callback('bad_request');

  const filters = [];
  questions.forEach(question => {
    if (question.type && question.type == 'range') {
      filters.push({
        _id: question._id,
        name: question.name,
        type: question.type,
        choices: Array.from({length: parseInt(question.max_value) - parseInt(question.min_value) + 1}, (_, i) => (parseInt(question.min_value) + i).toString())
      });
    } else if (question.type && (question.type == 'radio' || question.type == 'checked')) {
      filters.push({
        _id: question._id,
        name: question.name,
        type: question.type,
        choices: question.choices
      });
    }
  });

  return callback(null, filters);
}
