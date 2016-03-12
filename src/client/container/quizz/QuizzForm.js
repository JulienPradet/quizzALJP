import React from 'react'
import { List } from 'immutable'
import QuizzFormManager from './QuizzFormManager'
import Quizz from '../../../common/model/quizz/Quizz'
import QuestionForm from '../../components/quizz/QuestionForm'
import StepPathForm from '../../components/quizz/StepPathForm'
import AddStepForm from '../../components/quizz/AddStepForm'
import SaveForm from '../../components/quizz/SaveForm'
import QuizzHeaderForm from '../../components/quizz/QuizzHeaderForm'

import { FormGroup } from '../../components/ui/FormLayout'

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

  renderQuizzHeader(quizz) {
    return <QuizzHeaderForm quizz={quizz} onUpdate={this.actions.update} />
  }

  renderForm(activePath, quizz, accumulatedPath) {
    if(!quizz) {
      return
    }

    let activeStepKey = activePath.count() > 0
      ? activePath.first()
      : null

    const activeStep = quizz.steps().find((step) => step.key() === activePath.first()) || quizz.steps().first()
    activeStepKey = activeStep ? activeStep.key() : activeStepKey


    if(typeof accumulatedPath === 'undefined') {
      accumulatedPath = new List()
    }

    const stepsPath = quizz.steps().map((step) => {
      return <StepPathForm
        key={step.key()}
        active={step.key() === activePath.first()}
        step={step}
        onSelect={() => this.actions.updatePath(accumulatedPath.push(step.key()))}
      />
    })

    const addStepForm = <AddStepForm quizz={quizz} addStep={this.actions.addStep(accumulatedPath, quizz.steps().count())} />

    const activeStepComponent = activeStep
      ? (activeStep.steps
        ? this.renderForm(
          activePath.shift(),
          activeStep,
          accumulatedPath.push(activeStep.key())
        )
        : <QuestionForm question={activeStep} onUpdate={this.actions.setQuestion(accumulatedPath.push(activeStep.key()))} />)
      : null

    return (
      <div>
        <FormGroup legend="Steps" fieldset={true}>
          { stepsPath }
          { addStepForm }
        </FormGroup>

        {
          activeStepComponent
            ? <FormGroup legend="Current Step" fieldset={true}>
              { activeStepComponent }
            </FormGroup>
            : null
        }
      </div>
    )
  }

  render() {
    return <div>
      <form onSubmit={this.actions.save}>
        { this.renderQuizzHeader(this.state.quizz) }
        { this.renderForm(this.state.activePath, this.state.quizz) }
        <SaveForm onSave={this.saveQuizz} />
      </form>
    </div>
  }
}
