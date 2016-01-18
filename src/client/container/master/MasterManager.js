import history from '../../util/history'
import Immutable from 'immutable'
import Master from '../../communication/Master'
import MasterPeer from '../../communication/adapter/star_network/webrtc/MasterPeer'
import { Authenticator } from '../../communication/util/security'
import AUTH_ACTIONS from '../../constants/security'
import USERS_ACTIONS from '../../constants/users'
import PEER_TYPE from '../../constants/peers'

/* Connection of the master */
function connection(master) {
  return function connectionAux(getState, updateState) {
    master
      .on('connected', (masterId) => {
        updateState({ data: getState().data.set('id', masterId) })
        window.open(history.createHref('/viewer/'+masterId))
      })
  }
}

/* Store for the connected users => Immutable data store*/
let users = new Immutable.Map()
  .set(PEER_TYPE.VIEWER, new Immutable.List())
  .set(PEER_TYPE.MANAGER, new Immutable.List())
  .set(PEER_TYPE.PLAYER, new Immutable.List())

/* Connection of other peers and authentication of them */
function authentication(master, authenticator) {
  return function authenticationAux(getState, updateState) {
    master.message$.filter(({ type }) => type === AUTH_ACTIONS.AUTHENTICATE)
      .subscribe(({peerId, type, data}) => {
        /* Is the authentication a success ? */
        const isAuthenticated = authenticator.authenticate(master, peerId, data.type, data.token)

        if(isAuthenticated) {
          /* If it is, every components should update */
          users = users.set(data.type, users.get(data.type).push(peerId))
          master.broadcast(USERS_ACTIONS.USERS_HAS_UPDATED, {})
        } else {
          /* It failed, let the peer know */
          master.send(peerId, AUTH_ACTIONS.AUTHENTICATION_FAILED, {})
        }
      })
  }
}

/* A peer requested the list of users => Send it back */
function requestUsers(master) {
  return function requestUsersAux(getState, updateState) {
    master.message$.filter(({ type }) => type === USERS_ACTIONS.GET_ALL)
      .subscribe(({peerId, type, data}) => {
        master.send(peerId, USERS_ACTIONS.ALL, users.toJS())
      })
  }
}

/*
 * Global manager for master's actions
 * The fact that it's in purely functional styles allows it to separate the
 * listeners in multiple files
 */
export default function MasterManager(getState, updateState) {
  const master = Master(MasterPeer)
  const authenticator = Authenticator()

  connection(master)(getState, updateState)
  authentication(master, authenticator)(getState, updateState)
  requestUsers(master)(getState, updateState)
}
