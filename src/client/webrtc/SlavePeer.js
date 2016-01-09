import Rx from 'rx'
import { key } from './Peer'
import Peer from 'peerjs'

export default function SlavePeer(masterPeerId) {
  const message$ = new Rx.Subject()
  const eventCallbacks = {}
  let conn

  const peer = new Peer({ key })
    .on('open', function() {
      console.info('Slave: Connected. Attempting to connect to master.')

      conn = peer.connect(masterPeerId)
        .on('data', function(data) {
          console.info('Slave: Message received from '+conn.peer)
          message$.onNext({ peerId: conn.peer, data: data })
        })
        .on('open', function() {
          console.info('Slave: Connected to master')
        })
        .on('close', function() {
          console.log('Slave: Lost connection to master')
        })
        .on('error', function() {
          console.error('Slave: Error', arguments)
        })
      if(typeof eventCallbacks['open'] === 'function') {
        eventCallbacks['open'].apply(this, arguments)
      }
    })
    .on('disconnected', function() {
      console.info('Slave: Disconnected')
      if(typeof eventCallbacks['disconnected'] === 'function') {
        eventCallbacks['disconnected'].apply(this, arguments)
      }
    })
    .on('connection', function(conn) {
      console.info('Slave: New peer attempted to connect: '+conn.peer)
      console.warn('Rejecting peer')
      conn.close()
      if(typeof eventCallbacks['connection'] === 'function') {
        eventCallbacks['connection'].apply(this, arguments)
      }
    })
    .on('close', function() {
      console.info('Slave: Closing')
      if(typeof eventCallbacks['close'] === 'function') {
        eventCallbacks['close'].apply(this, arguments)
      }
    })
    .on('error', function(err) {
      console.error('Slave: Error', err)
      if(typeof eventCallbacks['error'] === 'function') {
        eventCallbacks['error'].apply(this, arguments)
      }
    })

  function send(data) {
    conn.send(masterPeerId, data)
  }

  return {
    id() {
      return peer.id
    },
    message$() {
      return message$
    },
    on(event, callback) {
      if(['open', 'disconnected', 'connection', 'close', 'error'].indexOf(event) >= 0) {
        eventCallbacks[event] = callback
      } else {
        console.warn('Wrong event name')
      }

      return this
    },
    send
  }
}
