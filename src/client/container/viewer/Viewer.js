import React from 'react'

export default class Viewer extends React.Component {
  render() {
    return <div>I'm a viewer of {this.props.params.masterId}!</div>
  }
}
