import { Authenticator, MESSAGE_TYPE } from './util/security'

export default function Master(PeerAdapter) {
  const eventCallbacks = {}
  const peer = PeerAdapter()
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
    .on('slaveDisconnected', function() {
      if(typeof eventCallbacks.slaveDisconnected === "function") {
        eventCallbacks.slaveDisconnected.apply(this, arguments)
      }
    })

  const message$ = peer.message$().map(x => {
    return {
      peerId: x.peerId,
      type: x.message.type,
      data: x.message.data
    }
  })

  message$.subscribe(function(message) { console.debug("MESSAGE:", message)})

  const master = {
    id() {
      return peer.id()
    },
    on(event, callback) {
      if(['connected', 'disconnected', 'slaveDisconnected'].indexOf(event) >= 0) {
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
    broadcast(type, data) {
      peer.broadcast({ type, data })
    },
    disconnect() {
      peer.disconnect()
    },
    message$
  }

  return master
}
