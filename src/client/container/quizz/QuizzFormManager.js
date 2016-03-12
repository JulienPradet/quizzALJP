import { List, fromJS } from 'immutable'

export default function QuizzFormManager(getState, updateState) {
  function getQuizz() {
    const { quizz } = getState()
    return quizz
  }

  function updateQuizz(stepPath, step, quizz) {
    if(quizz.key() === stepPath.first()) {
      updateQuizz(stepPath.shift(), step, quizz)
    } else {

    }
  }

  return {
    save() {
      console.log(getState().toString())
    },
    update(quizz) {
      updateState(quizz)
    },
    updatePath(stepPath, step) {
      if(!List.isList(stepPath)) {
        stepPath = fromJS(stepPath)
      }
      updateQuizz(stepPath, step, getQuizz())
    }
  }
}
