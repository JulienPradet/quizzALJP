import React from 'react'
import questions from '../../../common/model/quizz/questions/questions'
import { FormGroup, FormLabel, FormInput } from '../ui/FormLayout'
import { Label, Input } from '../ui/FormBase'
import Block from '../ui/Block'

export default class QuestionForm extends React.Component {
  updateTitle(event) {
    this.update({
      title: event.target.value
    })
  }

  updateAnswer(event) {
    this.update({
      answer: event.target.value
    })
  }

  update(updatedValues) {
    this.props.onUpdate(questions.get('simpleQuestion')({
      key: this.props.question.key(),
      title: updatedValues.hasOwnProperty('title') ? updatedValues.title : this.props.question.title(),
      answer: updatedValues.hasOwnProperty('answer') ? updatedValues.answer : this.props.question.answer(),
    }))
  }

  render() {
    return <Block>
      <FormGroup>
        <FormLabel htmlFor={this.props.question.key()+'__title'}>
          <Label>Title</Label>
        </FormLabel>
        <FormInput>
          <Input id={this.props.question.key()+'__title'} name={this.props.question.key()+'__title'} value={this.props.question.title()} onChange={this.updateTitle.bind(this)} />
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor={this.props.question.key()+'__answer'}>
          <Label>Answer</Label>
        </FormLabel>
        <FormInput>
          <Input id={this.props.question.key()+'__answer'} name={this.props.question.key()+'__answer'} value={this.props.question.answer()} onChange={this.updateAnswer.bind(this)} />
        </FormInput>
      </FormGroup>
    </Block>
  }
}
