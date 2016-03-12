import React from 'react'
import { FormGroup } from '../ui/FormLayout'
import { Button } from '../ui/FormBase'

export default function SaveForm(props) {
  return <FormGroup legend="Actions" fieldset={true}>
    <Button type="button" onClick={props.onSave}>Save</Button>
  </FormGroup>
}
