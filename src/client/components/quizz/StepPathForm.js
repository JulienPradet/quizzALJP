import React from 'react'
import StepButton from '../ui/form/Step'

export default function StepPathForm(props) {
  return <div style={{display: "inline-block"}}>
    <StepButton onClick={props.onSelect} active={props.active}>
      {props.name}
    </StepButton>
    { props.onDelete
      ? <StepButton onClick={props.onDelete} active={props.active}>
        &times;
      </StepButton>
      : null
    }
  </div>
}
