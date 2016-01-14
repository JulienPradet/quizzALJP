import React from 'react'
import Viewer from '../../webrtc/Viewer'
import { Map } from 'immutable'

export default class ViewerComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: Map()
    }
  }

  componentWillMount() {
    const masterId = this.props.params.masterId
    const viewer = Viewer(masterId)
      .on('connected', () => {
        this.setState({data: this.state.data.set('connected', true)})
      })
  }

  render() {
    return <div>
      { this.state.data.get('connected') ? `I'm a viewer of ${this.props.params.masterId}!` : 'Connecting to the master' }
    </div>
  }
}
