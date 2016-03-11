import React from 'react'
import PlayerManager from './PlayerManager'
import { Map } from 'immutable'

/**
 * The player component is the container for the player node
 */
export default class PlayerComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    const masterId = this.props.params.masterId
    this.playerActions = PlayerManager(masterId)(
      () => this.state.data,
      (data) => {
        this.setState({ data })
      }
    )
  }

  render() {
    /* Display the current state of the application */
    return <div>
      <h1>I'm a player</h1>
      { this.state.data.get('connected') ? `I'm a player of ${this.props.params.masterId}!` : 'Connecting to the master' }
    </div>
  }
}
