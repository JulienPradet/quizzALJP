import React from 'react'
import { FormGroup } from '../ui/FormLayout'
import { Button } from '../ui/FormBase'
import Block from '../ui/Block'

export default function SaveForm(props) {
  return <Block className="center" invisible={true}>
    <Button type="button" onClick={props.onSave}>Save</Button>
  </Block>
}
