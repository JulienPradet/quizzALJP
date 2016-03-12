import React from 'react'
import { List } from 'immutable'
import QuizzFormManager from './QuizzFormManager'
import Quizz from '../../../common/model/quizz/Quizz'
import QuestionForm from '../../components/quizz/QuestionForm'
import StepPathForm from '../../components/quizz/StepPathForm'
import SaveForm from '../../components/quizz/SaveForm'
import QuizzHeaderForm from '../../components/quizz/QuizzHeaderForm'

export default class QuizzForm extends React.Component {
  constructor(props) {
    super(props)

    if(props.hasOwnProperty('quizz')) {
      this.state = { quizz: props.quizz }
    } else if(props.hasOwnProperty('quizzKey')) {
      this.state = {
        quizz: Quizz({
          key: props.quizzKey,
        }),
        activePath: new List(),
      }
    } else {
      throw new Error('A key must be defined.')
    }
  }

  componentWillMount() {
    this.actions = QuizzFormManager(
      () => this.state.quizz,
      (quizz) => this.setState({quizz})
    )
  }

  renderQuizzHeader(quizz) {
    return <QuizzHeaderForm quizz={quizz} onUpdate={this.actions.update} />
  }

  renderForm(activeSubPath, quizz, accumulatedPath) {
    if(typeof accumulatedPath === 'undefined') {
      accumulatedPath = new List([quizz.key()])
    }

    const activeStepKey = activeSubPath.first()
    const steps = this.state.quizz.steps()

    const stepsPath = steps.map(function(step) {
      return <StepPathForm active={step.key() === activeStepKey} step={step} onUpdate={(step) => this.actions.updatePath(accumulatedPath.push(step.key()), step)}/>
    })

    if(activeStepKey) {
      const activeStep = steps.find((step) => step.key() === activeStepKey)
      if(activeStep) {
        stepsPath.push(
          typeof activeStep.steps === 'function'
            ? this.renderForm(activeSubPath.shift(), activeStep, [...accumulatedPath, activeStepKey])
            : <QuestionForm question={activeStep} onUpdate={this.actions.updatePath.bind(this)} />
        )
      }
    }

    return stepsPath
  }

  render() {
    return <div>
      <form onSubmit={this.actions.save}>
        { this.renderQuizzHeader(this.state.quizz) }
        { this.renderForm(this.state.activePath, this.state.quizz) }
        <SaveForm onSave={this.actions.save} />
      </form>
    </div>
  }
}
