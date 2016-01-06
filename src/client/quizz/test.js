import Quizz from '../../common/model/quizz/Quizz'
import QuizzContainer from '../../common/model/quizz/QuizzContainer'
import questions from '../../common/model/quizz/questions/questions'

const SimpleQuestion = questions.get('simpleQuestion')

export default function launchTest() {
  const quizz = Quizz({
      key: 'quizz'
    })
    .addStep(SimpleQuestion({
      key: 'hi',
      title: 'HI?',
      answer: 'HI',
    }));

  const quizzContainer = QuizzContainer({ quizz })

  function displayAnswer(answer, answerResult) {
    console.log(answer, 'is', (answerResult.isCorrect ? 'CORRECT!' : 'FALSE!'));
    console.log('Recap: ', answerResult.quizzContainer.result());

    return answerResult.quizzContainer;
  }

  let result = displayAnswer(
    'HI',
    quizzContainer.answer(
      'hi',
      'julien',
      'HI'
    )
  )

  result = displayAnswer(
    'HI',
    result.answer(
      'hi',
      'quentin',
      'HI'
    )
  )

  result = displayAnswer(
    'Nope',
    result.answer(
      'hi',
      'etienne',
      'Nope'
    )
  )

  result = displayAnswer(
    'Nope',
    result.answer(
      'hi',
      'etienne',
      'Nope'
    )
  )
}
