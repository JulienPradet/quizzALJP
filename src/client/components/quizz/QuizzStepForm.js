import React from 'react'
import QuestionForm from './QuestionForm'
import AddStepForm from './AddStepForm'
import RemoveStepForm from './RemoveStepForm'
import Quizz from '../../../common/model/quizz/Quizz'

export default class QuizzStepForm extends React.Component {
  updateStep(newStep) {
    this.props.onUpdate(this.props.step.setStep(newStep, newStep.key()))
  }

  addStep() {
    const key = this.props.step.steps().count();

    this.props.onUpdate(
      this.props.step.addStep(
        new Quizz({ key }),
        key
      )
    )
  }

  removeStep(key) {
    return function() {
      this.props.onUpdate(
        this.props.step.removeStep(key)
      )
    }
  }

  render() {
    return <div>
      <div>
        {
          this.props.step.steps()
            .map(step => {
              const StepComponent = step instanceof Quizz
                ? <QuizzStepForm step={step} onUpdate={this.updateStep.bind(this)} />
                : <QuestionForm question={step} onUpdate={this.updateStep.bind(this)} />

              return <div key={step.key()}>
                { StepComponent }
                <RemoveStepForm removeStep={this.removeStep(step.key()).bind(this)}/>
              </div>
            })
        }
      </div>

      <AddStepForm addStep={this.addStep.bind(this)} />
    </div>
  }
}
