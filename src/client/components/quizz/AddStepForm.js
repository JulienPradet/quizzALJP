import React from 'react'
import { Map } from 'immutable'
import Block from '../ui/Block'
import { FormGroup, FormLabel, FormInput } from '../ui/FormLayout'
import { Label, Select, Option, Button } from '../ui/FormBase'

const options = new Map()
  .set('quizz', {
    label: 'Quizz'
  })
  .set('question', {
    label: 'Question'
  })

const defaultOptionKey = 'question';

export default class AddStepForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: (new Map()).set('type', defaultOptionKey)
    }

    this.add = this.add.bind(this)
    this.close = this.close.bind(this)
  }

  updateType(event) {
    const newOptionKey = event.target.value
    this.setState({
      data : this.state.data.set(
        'type',
        options.has(newOptionKey) ? newOptionKey : defaultOptionKey
      )
    })
  }

  add() {
    this.props.addStep(this.state.data)
  }

  close() {
    this.props.close()
  }

  render() {
    // Select of the step type (quizz or question => if question : which question)
    return <Block className="tooltip">
      <FormGroup className="block block--small">
        <FormLabel>
          <Label htmlFor={this.props.id+'__type'}>Type of step</Label>
        </FormLabel>
        <FormInput>
          <Select name={this.props.id+'__type'} id={this.props.id+'__type'} value={this.state.data.get('type')} onChange={this.updateType.bind(this)}>
            { options.map((option, key) => {
              return <Option value={key} key={key}>{option.label}</Option>
            }).toList() }
          </Select>
        </FormInput>
      </FormGroup>
      <FormGroup className="block block--small">
        <Button type="button" onClick={this.add}>Add step</Button>
      </FormGroup>
      <FormGroup className="block block--small">
        <Button type="button" className='btn--inline' onClick={this.close}>Close</Button>
      </FormGroup>
    </Block>
  }
}
