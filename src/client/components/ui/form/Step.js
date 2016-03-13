import React from 'react'

export default function Step(props) {
  return <button type="button" onClick={props.onClick} className={"form-step "+(props.active ? "form-step--active" : '')}>
    { props.children }
  </button>
}
