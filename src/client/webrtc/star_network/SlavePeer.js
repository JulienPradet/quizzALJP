import Rx from 'rx'
import { key } from '../Peer'
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
          // The message is in an object to match the same architecture of
          // message as the MasterPeer
          message$.onNext({ message: data })
        })
        .on('open', function() {
          console.info('Slave: Connected to master')
          if(typeof eventCallbacks['connected'] === 'function') {
            eventCallbacks['connected'].apply(this, arguments)
          }
        })
        .on('close', function() {
          console.info('Slave: Lost connection to master')
          if(typeof eventCallbacks['disconnected'] === 'function') {
            eventCallbacks['disconnected'].apply(this, arguments)
          }
        })
        .on('error', function() {
          console.error('Slave: Error', arguments)
        })

    })
    .on('disconnected', function() {
      console.info('Slave: Disconnected')
    })
    .on('connection', function(conn) {
      console.info('Slave: New peer attempted to connect: '+conn.peer)
      console.warn('Rejecting peer')
      conn.close()
    })
    .on('close', function() {
      console.info('Slave: Closing')
    })
    .on('error', function(err) {
      console.error('Slave: Error', err)
    })

  return {
    id() {
      return peer.id
    },
    message$() {
      return message$
    },
    on(event, callback) {
      if(['connected', 'disconnected'].indexOf(event) >= 0) {
        eventCallbacks[event] = callback
      } else {
        console.warn('Wrong event name')
      }

      return this
    },
    send(data) {
      conn.send(data)
    },
    close() {
      peer.destroy()
    }
  }
}
