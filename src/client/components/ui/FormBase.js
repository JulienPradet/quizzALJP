import React from 'react'

export function Label(props) {
  return <label {...props}>{props.children}</label>
}

export function Input(props) {
  return <input {...props} />
}

export function Select(props) {
  return <select {...props}>{props.children}</select>
}

export function Option(props) {
  return <option {...props}>{props.children}</option>
}

export function Button(props) {
  return <button {...props} className={"btn "+props.className}>{props.children}</button>
}
