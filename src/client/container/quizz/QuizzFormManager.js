import { List, fromJS } from 'immutable'

import Quizz from '../../../common/model/quizz/Quizz'
import questions from '../../../common/model/quizz/questions/questions'
import { removeStep, updateQuizz } from '../../../common/model/quizz/QuizzHelper'

export default function QuizzFormManager(getState, updateState) {
  function dataToStep(data, path) {
    const parentKey = path.count() > 1
      ? path.pop().last()+'.'
      : ''
    const key = parentKey+path.last()

    return data.get('type') === 'quizz'
      ? Quizz({
        key
      })
      : questions.get('simpleQuestion')({
        key,
        title: '',
        answer: ''
      })
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
    addStep(path, id, data) {
      let newStep = dataToStep(data, path.push(id))
      if(data.get('type') === 'quizz') {
        newStep = newStep.setName('Step '+(id + 1))
      }
      updateState({
        quizz: updateQuizz(path.push(id), newStep, getState().quizz),
        activePath: path.push(newStep.key())
      })
    },
    removeStep(path) {
      updateState({
        quizz: removeStep(path, getState().quizz)
      })
    },
    setStep(path) {
      return (step) => {
        updateState({
          quizz: updateQuizz(path, step, getState().quizz)
        })
      }
    }
  }
}
