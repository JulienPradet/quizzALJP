import React from 'react'
import { FormGroup, FormInput, FormLabel } from '../FormLayout'
import { Input, Label } from '../FormBase'

export default function FormLine(props) {
  return (
    <FormGroup>
      <FormLabel>
        <Label forHtml={props.id}>{props.label}</Label>
      </FormLabel>
      <FormInput>
        <Input value={props.value} onChange={props.onChange} id={props.id} name={props.id} />
      </FormInput>
    </FormGroup>
  )
}
