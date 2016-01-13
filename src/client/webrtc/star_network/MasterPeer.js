import Rx from 'rx'
import { key } from '../Peer'
import Peer from 'peerjs'

export default function MasterPeer() {
  const message$ = new Rx.Subject()
  const eventCallbacks = {}

  const peer = new Peer({ key })
    .on('open', function(id) {
      console.info('Master: Connected '+id)
      if(typeof eventCallbacks['connected'] === 'function') {
        eventCallbacks['connected'].call(this, id)
      }
    })
    .on('disconnected', function() {
      console.info('Master: Disconnected')
      if(typeof eventCallbacks['disconnected'] === 'function') {
        eventCallbacks['disconnected'].call(this)
      }
    })
    .on('connection', function(conn) {
      console.info('Master: Slave connecting '+conn.peer)
      conn
        .on('open', function() {
          console.info('Master: Slave connected '+conn.peer)
          if(typeof eventCallbacks['slaveConnected'] === 'function') {
            eventCallbacks['slaveConnected'].call(this, conn.peer)
          }
        })
        .on('data', function(data) {
          console.info('Master: Message received from '+conn.peer)
          message$.onNext({ peerId: conn.peer, message: data })
        })
        .on('close', function() {
          console.info('Master: Slave disconnected '+conn.peer)
          if(typeof eventCallbacks['slaveDisconnected'] === 'function') {
            eventCallbacks['slaveDisconnected'].call(this, conn.peer)
          }
        })
        .on('error', function() {
          console.error('Master : Error', arguments)
        })
    })
    .on('close', function() {
      console.info('Master: Closing')
    })
    .on('error', function(err) {
      console.error('Master: Error', err)
    })

  function broadcast(data) {
    for(var peerId in peer.connections) {
      peer.connections[peerId].forEach(function(conn) {
        conn.send(data)
      })
    }

    return this
  }

  function send(peerId, data) {
    peer.connections[peerId].forEach(function(conn) {
      conn.send(data)
    })

    return this
  }

  return {
    id() {
      return peer.id
    },
    message$() {
      return message$
    },
    on(event, callback) {
      if(['connected', 'disconnected', 'slaveConnected', 'slaveDisconnected'].indexOf(event) >= 0) {
        eventCallbacks[event] = callback
      } else {
        console.warn('Wrong event name')
      }

      return this
    },
    broadcast,
    send,
    close() {
      peer.destroy()
    }
  }
}
