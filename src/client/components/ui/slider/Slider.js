import React from 'react'

import Error from '../error/Error'

export default class Slider extends React.Component {
  render() {
    const activeSlide = this.props.children.length > this.props.activeIndex
      ? this.props.children[activeIndex]
      : <Error>Wrong index displayed</Error>

    return (
      <div>
        { this.props.children[activeIndex] }
      </div>
    )
  }
}
