import test from 'tape'
import { Map } from 'immutable'
import MasterManager from '../../../../src/client/container/master/MasterManager'

function stateContainer(updateState) {
  let state = new Map()
  return {
    getState() {
      return state
    },
    updateState
  }
}

test('MasterManager connection', function(t) {
  const { getState, updateState } = stateContainer((newState) => {
    if(newState.get('id')) {
      t.pass('Master connects')
    } else {
      t.fail('Master fails to connect')
    }
    t.end()
    master.disconnect()
  })

  const master = MasterManager(getState, updateState)
})
