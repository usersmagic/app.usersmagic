// Get project results index page

module.exports = (req, res) => {
  return res.render('projects/report/index', {
    page: 'projects/report/index',
    title: 'Results',
    includes: {
      external: {
        css: ['page', 'general', 'header', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
        js: ['page']
      }
    },
    company: req.session.company,
    project: {
      name: 'Project Name',
      image: 'https://usersmagic.s3.amazonaws.com/9de808b1b10d9553d3a91b384f4d7a08'
    },
    questions: [
      {
        _id: '13sslkff02',
        type: 'opinion_scale',
        text: 'How much would you recommmend our app to your friends or family?',
        answers: {
          '0': 0,
          '1': 13,
          '2': 12,
          '3': 45,
          '4': 78,
          '5': 12,
          '6': 89,
          '7': 89,
          '8': 12,
          '9': 12,
          '10': 89
        },
        data: {
          'mean': 7.5,
          'median': 7
        }
      },
      {
        _id: '13ssl12ff02',
        type: 'yes_no',
        text: 'Do you have any active subscriptions in a meditation app?',
        answers: {
          'yes': 85,
          'no': 15
        }
      },
      {
        _id: '13ssl13ff02',
        type: 'open_answer',
        text: 'Explain your favorite part of the app.',
        answers: [
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.',
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.',
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.',
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.',
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.',
          'I liked the onboarding',
          'My favorite part is how you get recommended based on your selections.'
        ]
      },
      {
        _id: '13ssl12ff02',
        type: 'multiple_choice',
        text: 'Which of the following is your favorite?',
        answers: {
          'sports': 7,
          'movies': 4,
          'traveling': 2
        },
        data: {
          'max': 'sports'
        }
      },
    ]
  })
}
