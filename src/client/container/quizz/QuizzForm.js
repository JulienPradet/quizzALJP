import React from 'react'
import { List } from 'immutable'
import QuizzFormManager from './QuizzFormManager'
import SaveForm from '../../components/quizz/SaveForm'
import QuizzHeaderForm from '../../components/quizz/QuizzHeaderForm'
import QuizzStepForm from '../../components/quizz/QuizzStepForm'

import { FormGroup } from '../../components/ui/FormLayout'
import Block from '../../components/ui/Block'

export default class QuizzForm extends React.Component {
  constructor(props) {
    super(props)

    this.saveQuizz = this.saveQuizz.bind(this)

    if(props.hasOwnProperty('quizz')) {
      this.state = {
        quizz: props.quizz,
        activePath: new List()
      }
    } else {
      throw new Error('A quizz must be defined.')
    }
  }

  componentWillMount() {
    this.actions = QuizzFormManager(
      () => this.state,
      (state) => this.setState(state)
    )
  }

  saveQuizz() {
    this.props.saveQuizz(this.state.quizz)
  }

  render() {
    return <div>
      <form onSubmit={this.actions.save}>
        <QuizzStepForm
          activePath={this.state.activePath}
          quizz={this.state.quizz}
          accumulatedPath={new List()}
          addStep={this.actions.addStep}
          removeStep={this.actions.removeStep}
          setStep={this.actions.setStep}
          updatePath={this.actions.updatePath}
        />
        <SaveForm onSave={this.saveQuizz} />
      </form>
    </div>
  }
}
