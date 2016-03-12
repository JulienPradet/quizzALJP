import React from 'react'
import { List } from 'immutable'
import QuizzHeaderForm from './QuizzHeaderForm'
import QuestionForm from './QuestionForm'
import QuizzStepHead from './QuizzStepHead'
import RemoveStepForm from './RemoveStepForm'
import Block from '../ui/Block'
import { Button } from '../ui/FormBase'
import { FormGroup } from '../ui/FormLayout'

export default class QuizzStepForm extends React.Component {
  render() {
    let {activePath, quizz, accumulatedPath} = this.props
    if(!quizz) {
      return
    }

    const activeStep = quizz.steps().find((step) => step.key() === activePath.first())
    const activeStepKey = activeStep ? activeStep.key() : 'main'

    const activeStepComponent = activeStep
      ? (activeStep.steps
        ? <QuizzStepForm
            activePath={activePath.shift()}
            quizz={activeStep}
            accumulatedPath={accumulatedPath.push(activeStep.key())}
            addStep={this.props.addStep}
            removeStep={this.props.removeStep}
            setStep={this.props.setStep}
            updatePath={this.props.updatePath}
          />
        : <QuestionForm question={activeStep} onUpdate={this.props.setStep(accumulatedPath.push(activeStepKey))} />)
      : <QuizzHeaderForm quizz={quizz} onUpdate={this.props.setStep(accumulatedPath)} />

    return (
      <div>
        <QuizzStepHead
          activeStepKey={activeStepKey}
          accumulatedPath={accumulatedPath}
          quizz={quizz}
          addStep={this.props.addStep}
          removeStep={this.props.removeStep}
          updatePath={this.props.updatePath}
          />

        { activeStepComponent
          ? <FormGroup legend="Current Step" fieldset={true} className="block block--small">
            { activeStepComponent }
          </FormGroup>
          : null }
      </div>
    )
  }
}
