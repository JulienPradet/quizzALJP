import React from 'react'
import { Map } from 'immutable'
import MasterPeer from '../../webrtc/MasterPeer'
import history from '../../util/history'

export default class Master extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: Map()
    }
  }

  componentWillMount() {
    const masterPeer = MasterPeer()
      .on('connected', (masterId) => {
        this.setState({data: this.state.data.set('id', masterId)})
        console.log(history.createPath({
          pathname: 'viewer',
          query: { masterId }
        }))
        window.open(history.createHref('/viewer/'+masterId))
      })
  }

  render() {
    const currentId = this.state.data.has('id')
      ? <div>My id is { this.state.data.get('id') }.</div>
      : <div>I'm not connected yet.</div>

    return <div>
      I'm a master!
      { currentId }
    </div>
  }
}
