import React from 'react'
import StepButton from '../ui/form/Step'

export default class StepPathForm extends React.Component {
  constructor() {
    super()
  }

  render() {
    return <span>
      <StepButton onClick={this.props.onSelect} active={this.props.active}>
        {this.props.name}
      </StepButton>
      { this.props.onDelete
        ? <StepButton onClick={this.props.onDelete} active={this.props.active}>
          &times;
        </StepButton>
        : null
      }
    </span>
  }
}
