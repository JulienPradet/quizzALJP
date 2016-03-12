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
      ? Quizz({
        key
      })
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

    return updateQuizzAux(stepPath, step, getState().quizz)
  }

  function removeStep(path) {
    function removeStepAux(path, quizz) {
      if(path.count() === 0) {
        return quizz
      } else {
        const entry = quizz.steps().findEntry(function(step) {
          return step.key() === path.first()
        })
        if(entry) {
          if(path.count() === 1) {
            return quizz.removeStep(entry[0])
          } else {
            return quizz.setStep(removeStepAux(path.shift(), entry[1]), entry[0])
          }
        } else {
          return quizz
        }
      }
    }

    return removeStepAux(path, getState().quizz)
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
        quizz: updateQuizz(path.push(id), newStep),
        activePath: path.push(newStep.key())
      })
    },
    removeStep(path) {
      updateState({
        quizz: removeStep(path)
      })
    },
    setStep(path) {
      return (step) => {
        updateState({
          quizz: updateQuizz(path, step)
        })
      }
    }
  }
}
