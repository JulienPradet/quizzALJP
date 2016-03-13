import React from 'react'
import StepPathForm from './StepPathForm'
import AddStepForm from './AddStepForm'
import Block from '../ui/Block'
import StepButton from '../ui/form/Step'
import { Button } from '../ui/FormBase'
import { FormGroup } from '../ui/FormLayout'

export default class  QuizzStepHead extends React.Component {
  constructor() {
    super()

    this.state = {
      addStepForm: false
    }
    this.openAddStepForm = this.openAddStepForm.bind(this)
    this.closeAddStepForm = this.closeAddStepForm.bind(this)
    this.addStep = this.addStep.bind(this)
  }

  openAddStepForm() {
    this.setState({ addStepForm: true })
  }

  closeAddStepForm() {
    this.setState({ addStepForm: false })
  }

  addStep(data) {
    this.props.addStep(this.props.accumulatedPath, this.props.quizz.steps().count(), data)
    this.closeAddStepForm()
  }

  render() {
    const { activeStepKey, accumulatedPath, quizz, updatePath } = this.props

    const stepsPath = quizz.steps().map((step, key) => {
      return <StepPathForm
        key={step.key()}
        active={step.key() === activeStepKey}
        name={step.name && step.name() ? step.name() : 'Step '+(key + 1)}
        onSelect={() => this.props.updatePath(accumulatedPath.push(step.key()))}
        onDelete={() => this.props.removeStep(accumulatedPath.push(step.key()))}
      />
    })

    return <FormGroup legend="Steps" fieldset={true} className="block block--small">
      <div className="center">
        <StepPathForm
          key='main'
          active={true}
          name={quizz.name() ? 'Quizz: '+quizz.name() : 'Main information'}
          onSelect={() => this.props.updatePath(accumulatedPath.push('main'))}
        />
        { stepsPath }
        <span style={{position: 'relative'}}>
          <StepButton onClick={this.openAddStepForm} active={true}>+</StepButton>
          { this.state.addStepForm
            ? <AddStepForm quizz={quizz} addStep={this.addStep} close={this.closeAddStepForm} />
            : null }
        </span>
      </div>
    </FormGroup>
  }
}
