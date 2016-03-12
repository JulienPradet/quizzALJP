import React from 'react'

export default class StepPathForm extends React.Component {
  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) {
    event.preventDefault()
    this.props.onSelect()
  }

  render() {
    return <button onClick={this.onClick}>
      {this.props.active ? '>>>' : null}
      {this.props.step.key()}
    </button>
  }
}
