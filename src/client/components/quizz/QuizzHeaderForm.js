import React from 'react'
import { FormGroup } from '../ui/FormLayout'
import FormLine from '../ui/form/FormLine'

export default class QuizzHeaderForm extends React.Component {
  constructor() {
    super()
    this.updateName = this.updateName.bind(this)
    this.updateKey = this.updateKey.bind(this)
  }

  updateName(event) {
    this.props.onUpdate(
      this.props.quizz.setName(event.target.value)
    )
  }

  updateKey(event) {
    this.props.onUpdate(
      this.props.quizz.setKey(event.target.value)
    )
  }

  render() {
    return <FormGroup legend="Welcome to the quizz editor !" fieldset={true}>
      <FormLine id={this.props.quizz.key()+'.name'} label="Quizz name:" value={this.props.quizz.name()} onChange={this.updateName} />
      <FormLine id={this.props.quizz.key()+'.key'} label="Quizz key:" value={this.props.quizz.key()} onChange={this.updateKey} />
    </FormGroup>
  }
}
