import { Map } from 'immutable'
import React from 'react'

let counter = 0

export default class StateManager extends React.Component {
  updateState() {
    counter++
    this.props.sendState({'data': 'hello'+counter})
  }

  render() {
    return <div>
      <h2>State manager</h2>
      <ul>
        <li><button onClick={ this.updateState.bind(this) }>Update</button></li>
      </ul>
    </div>
  }
}
