import React from 'react'

export function FormGroup(props) {
  const legend = props.legend
    ? <legend>{props.legend}</legend>
    : null

  const Component = props.fieldset ? "fieldset" : "div"

  const className = "form_group " + (props.className || '')

  return <Component className={className}>
    {legend}
    {props.children}
  </Component>
}

export function FormInput(props) {
  return <div className="form__group__input">{props.children}</div>
}

export function FormLabel(props) {
  return <div className="form__group__label">{props.children}</div>
}
