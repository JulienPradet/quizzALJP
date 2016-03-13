import QUIZZ_ACTIONS from '../constants/quizz'

import Quizz from '../../common/model/quizz/Quizz'

function createQuizz(name, key) {
  return Quizz({
    key,
    name
  })
}

function getQuizzList() {
  return JSON.parse(window.localStorage.getItem('quizz-list') || "[]")
    .map((object) => Quizz.fromObject(object))
}

function saveQuizzList(list) {
  console.log("SAVE", list.map((quizz) => quizz.toObject()))
  window.localStorage.setItem('quizz-list', JSON.stringify(list.map((quizz) => quizz.toObject())))
  console.log("READ", getQuizzList().map((quizz) => quizz.toObject()))
}

export default function quizz(state, action) {
  if(typeof state === 'undefined') {
    state = {
      list: getQuizzList()
    }
  }

  switch(action.type) {
    case QUIZZ_ACTIONS.READ_QUIZZ_LIST:
      return Object.assign({}, state, {
        list: getQuizzList()
      })
    case QUIZZ_ACTIONS.SAVE_QUIZZ_LIST:
      saveQuizzList(state.list)
      return state
    case QUIZZ_ACTIONS.CREATE_QUIZZ:
      const newQuizz = createQuizz(action.name, state.list.length)
      return Object.assign({}, state, {
        list: [...state.list, newQuizz]
      })
    case QUIZZ_ACTIONS.SAVE_QUIZZ:
      const list = [...state.list.slice(0, action.id), action.quizz, ...state.list.slice(action.id + 1)]
      saveQuizzList(list)
      return Object.assign({}, state, {
        list
      })
    default:
      return state
  }
}
