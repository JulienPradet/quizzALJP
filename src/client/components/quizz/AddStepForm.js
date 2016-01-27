import React from 'react'

export default class AddStepForm extends React.Component {
  render() {
    // Select of the step type (quizz or question => if question : which question)
    return <button type="button" onClick={this.props.addStep}>Add step</button>
  }
}
