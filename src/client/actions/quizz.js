import QUIZZ_ACTIONS from '../constants/quizz'

export const readQuizzList = {
  type: QUIZZ_ACTIONS.READ_QUIZZ_LIST
}

export function createQuizz(name) {
  return {
    type: QUIZZ_ACTIONS.CREATE_QUIZZ,
    name
  }
}

export const saveQuizzList = {
  type: QUIZZ_ACTIONS.SAVE_QUIZZ_LIST
}

export function saveQuizz(id, quizz) {
  return {
    type: QUIZZ_ACTIONS.SAVE_QUIZZ,
    id,
    quizz
  }
}
