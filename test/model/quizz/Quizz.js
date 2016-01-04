import test from 'tape'
import Quizz from '../../../src/model/quizz/Quizz'
import questions from '../../../src/model/quizz/questions/questions'
import { InvalidArgumentError } from '../../../src/util/Error/BasicErrors'
import { is, List } from 'immutable'

test('instanciate a Quizz without the options and without key should throw an error', function(t) {
  t.throws(function() {
    SimpleQuestion(),
    InvalidArgumentError,
    'No option should throw an error'
  })

  t.throws(function() {
    SimpleQuestion({}),
    InvalidArgumentError,
    'No key should throw an error'
  })

  t.end()
});

test('a Quizz should be instanciate with a key', function(t) {
  const quizz = Quizz({
    key: 'key'
  });

  t.equal(quizz.key(), 'key');
  t.ok(is(quizz.steps(), List()));

  t.end();
});

test('a Quizz should have steps', function(t) {
  const SimpleQuestion = questions.get('simpleQuestion')

  const quizz = Quizz({
    key: 'key'
  })
    .addStep(Quizz({
        key: 'key1'
      }).addStep(SimpleQuestion({
          key: 'questionKey',
          title: 'title',
          answer: 'answer'
        })
      )
    )
    .addStep(SimpleQuestion({
        key: 'questionKey2',
        title: 'title2',
        answer: 'answer2'
      })
    )
    .addStep(SimpleQuestion({
        key: 'questionKey3',
        title: 'title3',
        answer: 'title3'
      })
    )
    .addStep(Quizz({
        key: 'key2',
      }).addStep(Quizz({
          key: 'key3',
        }).addStep(SimpleQuestion({
            key: 'questionKey4',
            title: 'title4',
            answer: 'title4'
          })
        )
      )
    );

  t.comment('Presence of subQuizz in steps and subSteps')
  t.ok(quizz.has('key1'));
  t.ok(quizz.has('key2'));
  t.ok(quizz.has('key3'));
  t.comment('Precense of questions in steps and subSteps')
  t.ok(quizz.has('questionKey'));
  t.ok(quizz.has('questionKey2'));
  t.ok(quizz.has('questionKey3'));
  t.ok(quizz.has('questionKey4'));

  t.comment('Going through steps')
  t.equal(quizz.nextStep().step.key(), 'key1')
  t.notOk(quizz.nextStep().quizz.has('key1'))
  t.equal(quizz.nextStep().step.nextStep().step.key(), 'questionKey')
  t.equal(quizz.nextStep().quizz.nextStep().step.key(), 'questionKey2')
  t.equal(quizz.nextStep().quizz.nextStep().quizz.nextStep().step.key(), 'questionKey3')
  const nextQuizz = quizz.nextStep().quizz.nextStep().quizz.nextStep().quizz;
  t.equal(nextQuizz.nextStep().step.key(), 'key2')
  t.equal(nextQuizz.nextStep().step.nextStep().step.key(), 'key3')
  t.equal(nextQuizz.nextStep().step.nextStep().step.nextStep().step.key(), 'questionKey4')
  t.equal(nextQuizz.nextStep().step.nextStep().step.nextStep().step.key(), 'questionKey4')

  t.comment('Check after steps has ended')
  t.equal(typeof nextQuizz.nextStep().quizz.nextStep().step, 'undefined');
  t.ok(is(nextQuizz.nextStep().quizz.nextStep().quizz.steps(), List()));

  t.end();
});
