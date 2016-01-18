import React from 'react'
import Viewer from '../../communication/Viewer'
import SlavePeer from '../../communication/adapter/star_network/webrtc/SlavePeer'
import { Map } from 'immutable'
import { STATE_TYPES } from '../../communication/StateManager.js'

export default class ViewerComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: Map()
    }
  }

  componentWillMount() {
    const masterId = this.props.params.masterId
    const viewer = Viewer(SlavePeer, masterId)
      .on('connected', () => {
        this.setState({data: this.state.data.set('connected', true)})
      })

    // Manage state updates
    viewer.message$
      .filter(x => {
        return x.type === STATE_TYPES.UPDATE
      })
      .subscribe(x => {
        this.setState({ data: this.state.data.set('shouldUpdate', true)})
      })
  }

  render() {
    return <div>
      <div>
        { this.state.data.get('connected') ? `I'm a viewer of ${this.props.params.masterId}!` : 'Connecting to the master' }
      </div>
      <div>
        { this.state.data.get('shouldUpdate') ? 'Should update' : '' }
      </div>
    </div>
  }
}
