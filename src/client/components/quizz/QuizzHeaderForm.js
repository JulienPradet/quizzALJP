import React from 'react'
import { FormGroup } from '../ui/FormLayout'
import FormLine from '../ui/form/FormLine'
import Block from '../ui/Block'

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
    return <Block>
      <FormGroup legend="Main information" fieldset={true}>
        <FormLine id={this.props.quizz.key()+'.name'} label="Quizz name:" value={this.props.quizz.name()} onChange={this.updateName} />
      </FormGroup>
    </Block>
  }
}
