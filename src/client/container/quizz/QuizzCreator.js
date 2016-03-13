import React from 'react'

import { connect } from 'react-redux'
import { createQuizz } from '../../actions/quizz'

import { FormGroup } from '../../components/ui/FormLayout'
import { Button } from '../../components/ui/FormBase'
import FormLine from '../../components/ui/form/FormLine'

export default class QuizzCreator extends React.Component{
  constructor() {
    super()
    this.state = { name: '' }
    this.updateName = this.updateName.bind(this)
    this.createQuizz = this.createQuizz.bind(this)
  }

  updateName(event) {
    this.setState({ name: event.target.value })
  }

  createQuizz(event) {
    event.preventDefault()
    if(this.state.name) {
      this.props.createQuizz(this.state.name)
      this.setState({ name: '' })
    }
  }

  render() {
    return <div>
      <form onSubmit={this.createQuizz}>
        <FormGroup legend="Add a quizz" fieldset={true}>
          <FormLine id={this.state.name} label="Quizz name:" value={this.state.name} onChange={this.updateName} />
          <Button>Create Quizz</Button>
        </FormGroup>
      </form>
    </div>
  }
}
