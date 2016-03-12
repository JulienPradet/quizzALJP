import { List, fromJS } from 'immutable'

import Quizz from '../../../common/model/quizz/Quizz'
import questions from '../../../common/model/quizz/questions/questions'

export default function QuizzFormManager(getState, updateState) {
  function dataToStep(data, path) {
    const parentKey = path.count() > 1
      ? path.pop().last()+'.'
      : ''
    const key = parentKey+path.last()

    return data.get('type') === 'quizz'
      ? Quizz({ key })
      : questions.get('simpleQuestion')({
        key,
        title: '',
        answer: ''
      })
  }

  function updateQuizz(stepPath, step) {
    function updateQuizzAux(stepPath, step, quizz) {
      if(stepPath.count() === 0) {
        return step
      } else {
        const entry = quizz.steps().findEntry(function(step) {
          return step.key() === stepPath.first()
        })
        if(entry) {
          return quizz.setStep(updateQuizzAux(stepPath.shift(), step, entry[1]), entry[0])
        } else {
          return quizz.addStep(updateQuizzAux(stepPath.shift(), step))
        }
      }
    }

    console.log(getState().quizz.name(), updateQuizzAux(stepPath, step, getState().quizz).name())

    return updateQuizzAux(stepPath, step, getState().quizz)
  }

  return {
    update(quizz) {
      updateState({ quizz })
    },
    updatePath(path) {
      updateState({
        activePath: path
      })
    },
    addStep(path, id) {
      return (data) => {
        const newStep = dataToStep(data, path.push(id))
        updateState({
          quizz: updateQuizz(path.push(id), newStep),
          activePath: path.push(newStep.key())
        })
      }
    },
    setQuestion(path) {
      return (question) => {
        updateState({
          quizz: updateQuizz(path, question),
          activePath: path.push(question.key())
        })
      }
    }
  }
}
