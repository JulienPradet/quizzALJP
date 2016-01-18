import test from 'tape'
import { Map } from 'immutable'
import MasterManager from '../../../../src/client/container/master/MasterManager'
import ViewerManager from '../../../../src/client/container/viewer/ViewerManager'

function stateContainer(updateState) {
  let state = new Map()
  return {
    getState() {
      return state
    },
    updateState
  }
}

test('ViewManager connection', {timeout: 5000}, function(t) {
  const masterStateContainer = stateContainer((newMasterState) => {
    const viewerStateContainer = stateContainer((newViewerState) => {
      if(newViewerState.get('connected')) {
        t.pass('Viewer connects')
        t.end()
        viewer.disconnect()
        master.disconnect()
      }
    })

    const viewer = ViewerManager(newMasterState.get('id'))(viewerStateContainer.getState, viewerStateContainer.updateState)
  })

  const master = MasterManager(masterStateContainer.getState, masterStateContainer.updateState)
})
