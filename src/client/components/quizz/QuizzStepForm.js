import React from 'react'
import QuestionForm from './QuestionForm'
import AddStepForm from './AddStepForm'
import RemoveStepForm from './RemoveStepForm'
import Quizz from '../../../common/model/quizz/Quizz'
import questions from '../../../common/model/quizz/questions/questions'
import { FormGroup } from '../ui/FormLayout'

export default class QuizzStepForm extends React.Component {
  updateStep(newStep) {
    this.props.onUpdate(this.props.step.setStep(newStep, newStep.key()))
  }

  addStep(stepDefinition) {
    const key = this.props.step.steps().count();

    const step = stepDefinition.get('type')
    const newStep = (step === 'quizz')
      ? Quizz({ key })
      : questions.get('simpleQuestion')({
        key: key,
        title: '',
        answer: ''
      })

    this.props.onUpdate(this.props.step.addStep(newStep, key))
  }

  removeStep(key) {
    return function() {
      this.props.onUpdate(this.props.step.removeStep(key))
    }
  }

  render() {
    return <div>
      {
        this.props.step.steps()
          .map(step => {
            const StepComponent = typeof step.addStep === 'function'
              ? <QuizzStepForm step={step} onUpdate={this.updateStep.bind(this)} />
              : <QuestionForm question={step} onUpdate={this.updateStep.bind(this)} />

            return <FormGroup key={step.key()}>
              { StepComponent }
              <RemoveStepForm removeStep={this.removeStep(step.key()).bind(this)}/>
            </FormGroup>
          })
      }

      <AddStepForm addStep={this.addStep.bind(this)} />
    </div>
  }
}
