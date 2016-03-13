import React from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import QuizzForm from './QuizzForm'
import { saveQuizz } from '../../actions/quizz'

export default class QuizzEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        quizz: props.list[props.params.quizzKey]
      }
    }
    this.saveQuizz = this.saveQuizz.bind(this)
  }

  saveQuizz(quizz) {
    this.props.saveQuizz(this.props.params.quizzKey, quizz)
  }

  render() {
    return <div>
      <QuizzForm saveQuizz={this.saveQuizz} quizz={this.state.data.quizz} />
    </div>
  }
}

export default connect(
  function(state) {
    return {
      list: state.quizz.list
    }
  },
  function(dispatch) {
    return {
      saveQuizz(id, quizz) {
        dispatch(saveQuizz(id, quizz))
      }
    }
  }
)(QuizzEditor)
