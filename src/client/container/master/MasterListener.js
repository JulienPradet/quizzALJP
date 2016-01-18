import history from '../../util/history'
import Immutable from 'immutable'
import { Authenticator } from '../../communication/util/security'
import AUTH_ACTIONS from '../../constants/security'
import USERS_ACTIONS from '../../constants/users'
import PEER_TYPE from '../../constants/peers'

/* Connection of the master */
function connection(master, getState, updateState) {
  master
    .on('connected', (masterId) => {
      updateState({ data: getState().data.set('id', masterId) })
      window.open(history.createHref('/viewer/'+masterId))
    })
}

/* Store for the connected users => Immutable data store*/
let users = new Immutable.Map()
  .set(PEER_TYPE.VIEWER, new Immutable.List())
  .set(PEER_TYPE.MANAGER, new Immutable.List())
  .set(PEER_TYPE.PLAYER, new Immutable.List())

/* Connection of other peers and authentication of them */
function authentication(authenticator) {
  return function authenticationAux(master, getState, updateState) {
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
function requestUsers(master, getState, updateState) {
  master.message$.filter(({ type }) => type === USERS_ACTIONS.GET_ALL)
    .subscribe(({peerId, type, data}) => {
      master.send(peerId, USERS_ACTIONS.ALL, users.toJS())
    })
}

/*
 * Global listener for master's actions
 * The fact that it's in purely functional styles allows it to separate the
 * listeners in multiple files
 */
export default function MasterListener(master, getState, updateState) {
  const authenticator = Authenticator()

  connection(master, getState, updateState)
  authentication(authenticator)(master, getState, updateState)
  requestUsers(master, getState, updateState)
}
