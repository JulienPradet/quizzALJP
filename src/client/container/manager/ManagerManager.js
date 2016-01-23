import { Subject as RxSubject } from 'rx'
import SlavePeer from '../../communication/adapter/star_network/webrtc/SlavePeer'
import MasterManager from '../master/MasterManager'
import Manager from '../../communication/Manager'

/* Listen to the connection of the manager to the master */
function connection(manager) {
  return function connectionAux(getState, updateState) {
    manager.on('connected', () => {
      updateState(getState().set('connected', true))
    })
  }
}

/* Launch the global actions of the manager */
function launchManager(masterId) {
  return function ManagerManagerAux(getState, updateState) {
    const manager = Manager(SlavePeer, masterId)
    updateState(getState().set('masterId', masterId))

    connection(manager)(getState, updateState)
  }
}

/*
 * Global manager for manager's actions
 * He launches the masterManager and is responsible of the state of the
 * ManagerComponent. The actual manager actions can be launched only once the
 * master has launched
 */
export default function ManagerManager(getState, updateState) {
  let masterState = new Map()
  const masterState$ = new RxSubject()

  MasterManager(
    () => masterState,
    (newState) => {
      masterState = newState
      masterState$.onNext(newState)
    }
  )

  masterState$.subscribe(function(newState) {
    if(newState.has('id')) {
      masterState$.dispose()
      launchManager(newState.get('id'))(getState, updateState)
    }
  })
}
