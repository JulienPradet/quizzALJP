import React from 'react'
import { Map } from 'immutable'
import history from '../../util/history'
import ManagerManager from './ManagerManager'

/**
 * Master component that lauches the master node
 * The node launches the MasterListener which actually the one responsible of
 * the business logic.
 * The container only uses dumb components. That's the top level component of
 * the App.
 */
export default class ManagerComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    this.actions = ManagerManager(
      () => this.state.data,
      (data) => {
        this.setState({ data })
      }
    )
  }

  render() {
    const currentId = this.state.data.has('connected') && this.state.data.get('connected')
      ? <div>I'm truly a manager now.</div>
      : <div>I'm not connected yet.</div>

    const viewerButton = this.state.data.has('masterId') && this.state.data.get('connected')
      ? <button onClick={ () => { window.open(history.createHref('/viewer/'+this.state.data.get('masterId'))) } }>Open a viewer</button>
      : null

    const authorizePlayersButtonLabel = this.state.data.has("authorizedPlayers") && this.state.data.get("authorizedPlayers")
      ? "Forbid players"
      : "Authorize players"

    const authorizePlayersButton = this.state.data.has('masterId') && this.state.data.get('connected')
      ? <button onClick={ () => { this.actions.togglePlayerAuthorization() } }>{authorizePlayersButtonLabel}</button>
      : null

    return <div>
      <h1>I'm a manager!</h1>
      { currentId }
      { viewerButton }
      { authorizePlayersButton }
    </div>
  }
}
