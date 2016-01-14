import MasterPeer from './star_network/MasterPeer'
import { Authenticator, MESSAGE_TYPE } from './util/security'

export default function Master() {
  const eventCallbacks = {}
  const peer = MasterPeer()
    .on('connected', function() {
      if(typeof eventCallbacks.connected === "function") {
        eventCallbacks.connected.apply(this, arguments)
      }
    })
    .on('disconnected', function() {
      if(typeof eventCallbacks.disconnected === "function") {
        eventCallbacks.disconnected.apply(this, arguments)
      }
    })

  const message$ = peer.message$().map(x => {
    return {
      peerId: x.peerId,
      type: x.message.type,
      data: x.message.data
    }
  })

  // Manage authentication
  const authenticator = Authenticator()
  message$.filter(x => x.type === MESSAGE_TYPE.AUTHENTICATE)
    .subscribe(({peerId, type, data}) => authenticator.authenticate(master, peerId, data.token))

  const master = {
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
    send(peerId, type, data) {
      peer.send(
        peerId,
        {
          type,
          data
        }
      )
    },
    message$
  }

  return master
}
