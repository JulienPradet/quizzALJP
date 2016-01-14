import React from 'react'
import { Map } from 'immutable'
import Master from '../../webrtc/Master'
import history from '../../util/history'

export default class MasterComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: Map()
    }
  }

  componentWillMount() {
    const master = Master()
      .on('connected', (masterId) => {
        this.setState({data: this.state.data.set('id', masterId)})
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
