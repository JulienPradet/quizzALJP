import React from 'react'
import { Map } from 'immutable'
import QuizzForm from './QuizzForm'
import ImportQuizzForm from './ImportQuizzForm'
import ExportQuizzForm from './ExportQuizzForm'
import QuizzManager from './QuizzManager'

export default class QuizzCreator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    this.actions = QuizzManager(
      () => this.state.data,
      (data) => this.setState({ data })
    )
  }

  render() {
    return <div>
      <QuizzForm saveQuizz={this.actions.saveQuizz} quizzKey="myquizz" />

      <ExportQuizzForm />
      <ImportQuizzForm />
    </div>
  }
}
