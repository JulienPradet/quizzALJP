export default function QuizzManager(getState, updateState) {
  return {
    save() { console.log('save') },
    update(quizz) { updateState(quizz) }
  }
}
