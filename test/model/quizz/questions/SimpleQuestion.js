import test from 'tape'
import SimpleQuestion from '../../../../src/model/quizz/questions/SimpleQuestion'
import { InvalidArgumentError } from '../../../../src/util/Error/BasicErrors'
import { is, Map } from 'immutable'

test('instanciate a SimpleQuestion without the options and without key should throw an error', function(t) {
  t.throws(function() {
    SimpleQuestion(),
    InvalidArgumentError,
    'No option should throw an error'
  })

  const key = 'key';
  const title = 'title';
  const answer = 'answer';

  t.throws(function() {
    SimpleQuestion({title, answer}),
    InvalidArgumentError,
    'No key should throw an error'
  })

  t.throws(function() {
    SimpleQuestion({key, answer}),
    InvalidArgumentError,
    'No title should throw an error'
  })

  t.throws(function() {
    SimpleQuestion({key, title}),
    InvalidArgumentError,
    'No answer should throw an error'
  })

  t.end()
});

test('instanciate a SimpleQuestion with minimum options', function(t) {
  const simpleQuestion = SimpleQuestion({
    key: 'key',
    title: 'title',
    answer: 'answer'
  })

  t.equal(simpleQuestion.key(), 'key')
  t.equal(simpleQuestion.title(), 'title')
  t.equal(simpleQuestion.answer(), 'answer')
  t.ok(is(simpleQuestion.suggestedAnswers(), Map()))

  t.end()
})

test('instanciate a SimpleQuestion with maximum options', function(t) {
  const simpleQuestion = SimpleQuestion({
    key: 'key',
    title: 'title',
    answer: 'answer',
    availablePoints: 10,
    suggestedAnswers: Map({test: 'test'})
  })

  t.equal(simpleQuestion.key(), 'key')
  t.equal(simpleQuestion.title(), 'title')
  t.equal(simpleQuestion.answer(), 'answer')
  t.ok(is(simpleQuestion.suggestedAnswers(), Map({test: 'test'})))

  t.end()
})

test('define the simpleQuestion attitude', function(t) {
  const simpleQuestion = SimpleQuestion({
    key: 'key',
    title: 'title',
    answer: 'answer'
  })

  t.comment('firstAnswer : Correct + win')
  const firstAnswer = simpleQuestion.isCorrect('answer', 'pointKey')
  t.ok(firstAnswer.isCorrect)
  t.equal(firstAnswer.points, 1)
  t.equal(firstAnswer.question.key(), 'key')
  t.equal(firstAnswer.question.title(), 'title')
  t.equal(firstAnswer.question.answer(), 'answer')
  t.ok(is(firstAnswer.question.suggestedAnswers(), Map({'pointKey': 'answer'})))

  t.comment('secondAnswer : Correct + no win')
  const secondAnswer = firstAnswer.question.isCorrect('answer', 'pointKey2');
  t.ok(secondAnswer.isCorrect)
  t.equal(secondAnswer.points, 0)
  t.equal(secondAnswer.question.key(), 'key')
  t.equal(secondAnswer.question.title(), 'title')
  t.equal(secondAnswer.question.answer(), 'answer')
  t.ok(is(secondAnswer.question.suggestedAnswers(), Map({'pointKey': 'answer', 'pointKey2': 'answer'})))

  t.comment('thirdAnswer : Incorrect + no win')
  const thridAnswerFailed = secondAnswer.question.isCorrect('answer1', 'pointKey3');
  t.notOk(thridAnswerFailed.isCorrect)
  t.equal(thridAnswerFailed.points, -1)
  t.equal(thridAnswerFailed.question.key(), 'key')
  t.equal(thridAnswerFailed.question.title(), 'title')
  t.equal(thridAnswerFailed.question.answer(), 'answer')
  t.ok(is(thridAnswerFailed.question.suggestedAnswers(), Map({'pointKey': 'answer', 'pointKey2': 'answer', 'pointKey3': 'answer1'})))

  t.comment('firstFailedAnswer : Incorrect + no win')
  const firstFailedAnswer = simpleQuestion.isCorrect('answer1', 'pointKey3')
  t.notOk(firstFailedAnswer.isCorrect)
  t.equal(firstFailedAnswer.points, -1)
  t.equal(firstFailedAnswer.question.key(), 'key')
  t.equal(firstFailedAnswer.question.title(), 'title')
  t.equal(firstFailedAnswer.question.answer(), 'answer')
  t.ok(is(firstFailedAnswer.question.suggestedAnswers(), Map({'pointKey3': 'answer1'})))

  t.comment('secondFailedAnswer : Incorrect + no win')
  const secondFailedAnswer = firstFailedAnswer.question.isCorrect('answer1', 'pointKey3')
  t.notOk(secondFailedAnswer.isCorrect)
  t.equal(secondFailedAnswer.points, 0)
  t.equal(secondFailedAnswer.question.key(), 'key')
  t.equal(secondFailedAnswer.question.title(), 'title')
  t.equal(secondFailedAnswer.question.answer(), 'answer')
  t.ok(is(secondFailedAnswer.question.suggestedAnswers(), Map({'pointKey3': 'answer1'})))

  t.comment('secondSuccessAnswerSamePointKey : Correct + no win')
  const secondSuccessAnswerSamePointKey = firstFailedAnswer.question.isCorrect('answer', 'pointKey3')
  t.ok(secondSuccessAnswerSamePointKey.isCorrect)
  t.equal(secondSuccessAnswerSamePointKey.points, 0)
  t.equal(secondSuccessAnswerSamePointKey.question.key(), 'key')
  t.equal(secondSuccessAnswerSamePointKey.question.title(), 'title')
  t.equal(secondSuccessAnswerSamePointKey.question.answer(), 'answer')
  t.ok(is(secondSuccessAnswerSamePointKey.question.suggestedAnswers(), Map({'pointKey3': 'answer1'})))

  t.comment('secondSuccessAnswerSamePointKey : Correct + win')
  const firstSuccessAnswer = secondSuccessAnswerSamePointKey.question.isCorrect('answer', 'pointKey2')
  t.ok(firstSuccessAnswer.isCorrect)
  t.equal(firstSuccessAnswer.points, 1)
  t.equal(firstSuccessAnswer.question.key(), 'key')
  t.equal(firstSuccessAnswer.question.title(), 'title')
  t.equal(firstSuccessAnswer.question.answer(), 'answer')
  t.ok(is(firstSuccessAnswer.question.suggestedAnswers(), Map({'pointKey3': 'answer1', 'pointKey2': 'answer'})))

  t.end()
})
