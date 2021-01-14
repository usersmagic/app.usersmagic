const mongoose = require('mongoose');
const validator = require('validator');

const Project = require('../project/Project');

const Schema = mongoose.Schema;

const SubmitionSchema = new Schema({
  campaign_id: {
    // Id of the campaign that the submition is created for
    type: String,
    required: true
  },
  user_id: {
    // Id of the user that the submition is created for
    type: String,
    required: true
  },
  target_id: {
    // Id of the target group for private campaigns,
    type: String,
    default: null
  },
  type: {
    // Type of the submition: [url, target]
    type: String,
    default: 'target'
  },
  is_private_campaign: {
    // Info of the submition showing if it belongs to a private campaign
    type: Boolean,
    required: true
  },
  created_at: {
    // The unixtime that the submition is created
    type: Number,
    default: (new Date()).getTime()
  },
  ended_at: {
    // The unixtime the submition is ended
    type: Number,
    default: null
  },
  answers: {
    // Answers array, matching the questions of the project
    type: Object,
    default: {}
  },
  status: {
    // Status of the submition: [saved, waiting, approved, unapproved, timeout]
    type: String,
    default: 'saved'
  },
  reject_message: {
    // Reject message about the submition, if its status is unapproved
    type: String,
    default: null
  },
  last_question: {
    // Last question that the user answer on the submition
    type: Number,
    default: -1
  },
  will_terminate_at: {
    // The unixtime the submition will timeout, if is is a private campaign
    type: Number,
    default: null
  }
});

SubmitionSchema.statics.findSubmitionsCumulativeDataByCampaignId = function (id, callback) {
  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Submition = this;

  Project.findById(mongoose.Types.ObjectId(id.toString()), (err, project) => {
    if (err || !project) return callback('document_not_found');

    Submition.find({
      campaign_id: id,
      status: 'approved'
    }, (err, submitions) => {
      if (err) return callback(err);

      const questions = project.questions.map(question => {
        const newQuestion = {
          _id: question._id,
          type: question.type,
          text: question.text,
          details: question.details
        }

        if (question.type == 'yes_no') {
          newQuestion.answers = {
            'yes': 50,
            'no': 50
          }
          newQuestion.data = {
            'yes_number': 0,
            'no_number': 0
          }
        } else if (question.type == 'multiple_choice') {
          newQuestion.answers = {};
          for (let i = 0; i < question.choices.length; i++)
            newQuestion.answers[question.choices[i]] = 0;
          newQuestion.data = {};
        } else if (question.type == 'opinion_scale') {
          newQuestion.answers = {};
          newQuestion.answer_percentages = {};
          newQuestion.data = {};
          for (let i = question.range.min; i <= question.range.max; i++)
            newQuestion.answers[i] = newQuestion.answer_percentages[i] = 0;
        } else if (question.type == 'open_answer') {
          newQuestion.answers = [];
        }

        return newQuestion;
      });

      for (let i = 0; i < submitions.length; i++) {
        const submition = submitions[i];

        for (let j = 0; j < submition.answers.length; j++) {
          const answer = submitions.answers[j];

          if (questions[j].type == 'yes_no' && (answer == 'yes' || answer == 'no')) {
            questions[j].data[`${answer}_number`]++;
          } else if (questions[j].type == 'multiple_choice') {
            questions[j].answers[answer]++;
          } else if (questions[j].type == 'opinion_scale') {
            questions[j].answers[answer]++; 
          } else if (questions[j].type == 'open_answer') {
            questions[j].answers.push(answer);
          }
        }
      }

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        if (question.type == 'yes_no') {
          question.answers = {
            'yes': question.data.yes_number / (question.data.yes_number + question.data.no_number) * 100,
            'no': question.data.no_number / (question.data.yes_number + question.data.no_number) * 100
          }
        } else if (question.type == 'multiple_choice') {
          let max = null, max_value = 0, total = 0;

          for (let j = 0; j < Object.keys(question.answers); j++) {
            if (Object.values(question.answers)[j] > max_value) {
              max_value = Object.values(question.answers)[j];
              max = Object.keys(question.answers)[j];
            }
            total += Object.values(question.answers)[j];
          }

          newQuestion.data = {
            max: max,
            total: total
          };
        } else if (question.type == 'opinion_scale') {
          let total = 0, value_total = 0; median, mean, median_distance = 0;

          for (let j = question.range.min; j <= question.range.max; j++) {
            total += question.answers[j];
            value_total += j * question.answers[j];
          }

          mean = parseInt(value_total / value_total * 100) / 100.0;
          
          for (let j = question.range.min; j <= question.range.max && median_distance <= total/2; j++) {
            median_distance += question.answers[j];
            if (median_distance >= total/2)
              median = j;
          }

          for (let j = question.range.min; j <= question.range.max; j++) {
            newQuestion.answer_percentages[j] = question.answers[j] / total * 100;
          }

          newQuestion.data = {
            mean: mean,
            media: median,
            total_number: total
          };
        }
      }

      return callback(null, questions);
    });
  });
}

module.exports = mongoose.model('Submition', SubmitionSchema);
