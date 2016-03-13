import Quizz from '../../../common/model/quizz/Quizz'

export default function QuizzCreatorManager(getState, updateState) {
  updateState({
    quizz: Quizz({
      key: "quizz",
      name: ""
    })
  })

  return {
    saveQuizz(quizz) {
      console.log(quizz.name(), quizz.toString())
    }
  }
}
