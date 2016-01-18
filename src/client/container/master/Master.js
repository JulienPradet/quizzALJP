import React from 'react'
import { Map } from 'immutable'
import Master from '../../communication/Master'
import MasterPeer from '../../communication/adapter/star_network/webrtc/MasterPeer'
import StateManager from './StateManager.js'
import history from '../../util/history'
import { STATE_TYPES } from '../../communication/StateManager.js'

export default class MasterComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: Map()
    }
  }

  componentWillMount() {
    const master = this.master = Master(MasterPeer)
      .on('connected', (masterId) => {
        this.setState({data: this.state.data.set('id', masterId)})
        window.open(history.createHref('/viewer/'+masterId))
      })
  }

  sendState(data) {
    this.master.broadcast(STATE_TYPES.UPDATE, data)
  }

  render() {
    const currentId = this.state.data.has('id')
      ? <div>My id is { this.state.data.get('id') }.</div>
      : <div>I'm not connected yet.</div>

    return <div>
      <h1>I'm a master!</h1>
      { currentId }
      <StateManager sendState={this.sendState.bind(this)} />
    </div>
  }
}
