export function updateQuizz(stepPath, step, quizz) {
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

  return updateQuizzAux(stepPath, step, quizz)
}

export function removeStep(path, quizz) {
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

  return removeStepAux(path, quizz)
}
