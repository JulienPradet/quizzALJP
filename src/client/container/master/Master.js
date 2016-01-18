import React from 'react'
import { Map } from 'immutable'
import history from '../../util/history'
import MasterManager from './MasterManager'

/**
 * Master component that lauches the master node
 * The node launches the MasterListener which actually the one responsible of
 * the business logic.
 * The container only uses dumb components. That's the top level component of
 * the App.
 */
export default class MasterComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: new Map()
    }
  }

  componentWillMount() {
    MasterManager(
      () => this.state.data,
      (data) => {
        this.setState({ data })
      }
    )
  }

  render() {
    const currentId = this.state.data.has('id')
      ? <div>My id is { this.state.data.get('id') }.</div>
      : <div>I'm not connected yet.</div>

    const viewerButton = this.state.data.has('id')
      ? <button onClick={ () => { window.open(history.createHref('/viewer/'+this.state.data.get('id'))) } }>Open a viewer</button>
      : null

    return <div>
      <h1>I'm a master!</h1>
      { currentId }
      { viewerButton }
    </div>
  }
}
