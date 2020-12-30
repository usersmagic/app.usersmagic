// Validate questions and return them if there is no error
// If options {final: true} is set validates questions for their final shape

module.exports = (questions, options, callback) => {
  if (!questions)
    return callback('bad_request');

  if (options.final && !questions.length)
    return callback('bad_request');

  const newQuestions = [];
  const allowedQuestionTypes = ['yes_no', 'multiple_choice', 'opinion_scale', 'open_answer'];
  const questionIdLength = 11, maxQuestionTextLength = 1000, maxQuestionLongTextLength = 5000, maxQuestionAnswerLength = 5000;
  const rangeMinValue = 0, rangeMaxValue = 10;

  questions.forEach(question => {
    if (!question || !question.type || !question._id || question._id.length != questionIdLength)
      return callback('bad_request');

    if (!allowedQuestionTypes.includes(question.type))
      return callback('unknown_question_type');

    if (question.text && question.text.length > maxQuestionTextLength)
      return callback('character_limit');

    if (options.final && (!question.text || !question.text.length))
      return callback('bad_request');

    if (question.details && question.details.length > maxQuestionLongTextLength)
      return callback('character_limit');

    const newQuestionData = {
      type: question.type,
      _id: question._id,
      text: question.text || '',
      details: question.details && question.details.length ? question.details : null,
      image: question.image && question.image.length ? question.image : null,
      required: question.required
    };

    if (question.type == 'multiple_choice') {
      if (!question.subtype || (question.subtype != 'single' || question.subtype != 'multiple'))
        return callback('unknown_question_type');

      if (options.final && (!question.choices || !question.choices.length))
        return callback('bad_request');

      if (question.choices && question.choices.filter(choice => choice.length > maxQuestionTextLength).length)
        return callback('character_limit');
      
      newQuestionData.subtype = question.subtype;
      newQuestionData.choices = question.choices || [];
    } else if (question.type == 'opinion_scale') {
      const range = {
        min: question.range && question.range.min ? question.range.min : '',
        max: question.range && question.range.max ? question.range.max : ''
      };
      const labels = {
        left: question.labels && question.labels.left ? question.labels.left : '',
        middle: question.labels && question.labels.middle ? question.labels.middle : '',
        right: question.labels && question.labels.right ? question.labels.right : ''
      };

      if (options.final && (!question.range.min.length || !question.range.max.length))
        return callback('bad_request');
      
      if (range.min.length && (!Number.isInteger(range.min) || parseInt(range.min) < rangeMinValue))
        return callback('bad_request');

      if (range.max.length && (!Number.isInteger(range.max) || parseInt(range.max) > rangeMaxValue))
        return callback('bad_request');
      
      if (range.min.length && range.max.length && parseInt(range.min) >= parseInt(range.max))
        return callback('bad_request');

      if (labels.left.length > maxQuestionTextLength || labels.middle.length > maxQuestionTextLength || labels.right.length > maxQuestionTextLength)
        return callback('bad_request');

      newQuestionData.range = range;
      newQuestionData.labels = labels;
    } else if (question.type == 'open_answer') {
      newQuestionData.max_answer_length = maxQuestionAnswerLength;
    }

    newQuestions.push(newQuestionData);
  });

  return callback(null, newQuestions)
}
