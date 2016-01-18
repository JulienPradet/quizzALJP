import React from 'react'
import { Map } from 'immutable'
import Master from '../../communication/Master'
import MasterPeer from '../../communication/adapter/star_network/webrtc/MasterPeer'
import MasterListener from './MasterListener'


export default class MasterComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    const master = this.master = Master(MasterPeer)
    console.log(this)
    MasterListener(
      master,
      () => this.state,
      this.setState.bind(this)
    )
  }

  render() {
    const currentId = this.state.data.has('id')
      ? <div>My id is { this.state.data.get('id') }.</div>
      : <div>I'm not connected yet.</div>

    return <div>
      <h1>I'm a master!</h1>
      { currentId }
    </div>
  }
}
