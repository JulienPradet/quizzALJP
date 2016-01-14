import SlavePeer from './star_network/SlavePeer'
import { login, MESSAGE_TYPE, PEER_TYPE } from './util/security'

const VIEWER = 'VIEWER'

export default function Viewer(masterId) {
  const eventCallbacks = {}
  let token

  // Use a slave in order to define how the viewer should interact with the
  // master
  const peer = SlavePeer(masterId)
    // Authenticate as a viewer
    .on('connected', () => {
      login(viewer, PEER_TYPE.VIEWER, token)
    })
    .on('disconnected', function() {
      if(typeof eventCallbacks.disconnected === "function") {
        eventCallbacks.disconnected.apply(this, arguments)
      }
    })

  // Change the messages stream so that it doesn't have the overhead needed in
  // the star network
  const message$ = peer.message$().map(x => {
    return x.message
  })

  // Manage authentication
  message$
    .filter(x => {
      return x.type === MESSAGE_TYPE.IS_AUTHENTICATED
    })
    .map(x => { x.token })
    .subscribe((newToken) => {
      token = newToken
      if(typeof eventCallbacks.connected === "function") {
        eventCallbacks['connected']()
      }
    })

  message$
    .filter(x => {
      return x.type === MESSAGE_TYPE.AUTHENTICATION_FAILED
    })
    .subscribe(() => {
      token = undefined
    })

  const viewer = {
    id() {
      return peer.id()
    },
    on(event, callback) {
      if(['connected', 'disconnected'].indexOf(event) >= 0) {
        eventCallbacks[event] = callback
      } else {
        console.warn('Wrong event name')
      }

      return this
    },
    send(type, data) {
      peer.send({
        type,
        data
      })
    },
    message$
  }

  return viewer
}
