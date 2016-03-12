import React from 'react'

export default function Block(props) {
  const newProps = Object.assign({}, props, {
    className: "block "+
      (props.invisible ? "" : "block--primary ")+
      (props.noMarginTop ? "" : "block--no-margin-top ")+
      (props.className || '')
  })
  return (
    <div {...newProps} />
  )
}
