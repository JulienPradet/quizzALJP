import React from 'react'
import Viewer from '../../communication/Viewer'
import SlavePeer from '../../communication/adapter/star_network/webrtc/SlavePeer'
import ViewerListener from './ViewerListener'
import { Map } from 'immutable'
import { STATE_TYPES } from '../../communication/StateManager.js'

/**
 * The viewer component is the container for the viewer node
 * It displays the current state of the application and never trigger actions
 * on the master node
 */
export default class ViewerComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    const masterId = this.props.params.masterId
    const viewer = Viewer(SlavePeer, masterId)
    this.viewerActions = ViewerListener(
      viewer,
      () => this.state,
      this.setState.bind(this)
    )
  }

  render() {
    /* Display the list of users */
    const users = this.state.data.get('users')
    const usersList = users
      ? Object.keys(users).map(key => {
        return <div key={key}>
          <h2>{ key }</h2>
          <ul>
            { users[key].map(user => <li key={user}>{ user }</li>) }
          </ul>
        </div>
      })
      : null

    /* Display the current state of the application */
    return <div>
      <div>
        <h1>I'm a viewer</h1>
        { this.state.data.get('connected') ? `I'm a viewer of ${this.props.params.masterId}!` : 'Connecting to the master' }
      </div>
      <div>
        <button onClick={this.viewerActions.requestUsers}>UpdateUsers</button>
        { usersList }
      </div>
    </div>
  }
}
