export default function QuizzFormManager(getState, updateState) {
  return {
    save() {
      console.log(getState().toString())
    },
    update(quizz) {
      updateState(quizz)
    }
  }
}
