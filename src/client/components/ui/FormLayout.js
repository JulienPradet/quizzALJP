import React from 'react'

export function FormGroup(props) {
  return <fieldset className="form__group">{props.children}</fieldset>
}

export function FormInput(props) {
  return <div className="form__group__input">{props.children}</div>
}

export function FormLabel(props) {
  return <div className="form__group__label">{props.children}</div>
}
