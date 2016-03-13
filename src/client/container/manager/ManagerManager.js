import { Subject as RxSubject } from 'rx'
import SlavePeer from '../../communication/adapter/star_network/webrtc/SlavePeer'
import MasterManager from '../master/MasterManager'
import Manager from '../../communication/Manager'
import AUTH_ACTIONS from '../../constants/security'

/* Listen to the connection of the manager to the master */
function connection(manager) {
  return function connectionAux(getState, updateState) {
    manager.on('connected', () => {
      updateState(getState().set('connected', true))
    })
  }
}

/* A peer manager receive messages from master to know if players are authorized to connect */
function authenticationGuardian(manager) {
  return function authenticationGuardianAux(getState, updateState) {
    manager.message$.filter(({ type }) => type === AUTH_ACTIONS.OPENED_TO_PLAYERS)
      .subscribe(({peerId, type, data}) => {
        updateState(getState().set('authorizedPlayers', true))
      })

    manager.message$.filter(({ type }) => type === AUTH_ACTIONS.CLOSED_TO_PLAYERS)
      .subscribe(({peerId, type, data}) => {
        updateState(getState().set('authorizedPlayers', false))
      })
  }
}

/* Launch the global actions of the manager */
function launchManager(masterId) {
  return function ManagerManagerAux(getState, updateState) {
    const manager = Manager(SlavePeer, masterId)
    updateState(getState().set('masterId', masterId))

    connection(manager)(getState, updateState)
    authenticationGuardian(manager)(getState, updateState)

    return manager
  }
}

/*
 * Global manager for manager's actions
 * He launches the masterManager and is responsible of the state of the
 * ManagerComponent. The actual manager actions can be launched only once the
 * master has launched
 */
export default function ManagerManager(getState, updateState) {
  let manager
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
      manager = launchManager(newState.get('id'))(getState, updateState)
    }
  })

  return {
    togglePlayerAuthorization: () => {
      if(manager) {
        var state = getState()
        if(state.has('authorizedPlayers') && state.get('authorizedPlayers')) {
          manager.send(AUTH_ACTIONS.CLOSE_TO_PLAYERS)
        } else {
          manager.send(AUTH_ACTIONS.OPEN_TO_PLAYERS)
        }
      }
    }
  }
}
