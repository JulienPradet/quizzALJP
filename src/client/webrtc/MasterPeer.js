import { List } from 'immutable'
import Peer from './Peer'


export default function MasterPeer() {
  const peer = Peer()
    .on('peer.open', function() {
      console.info('Master: Connected'+peer.id())
    })
    .on('peer.disconnected', function() {
      console.info('Master: Disconnected')
    })
    .on('peer.connection', function(conn) {
      console.info('Master: New peer connected: '+conn.peer)
    })
    .on('peer.call', function(conn) {
      conn.answer();
      console.info('Master: Answered to: '+conn.peer)
    })
    .on('peer.close', function() {
      console.info('Master: Closing')
    })
    .on('peer.error', function(err) {
      console.error('Master: Error', err)
    })

  return {
    message$() {
      return peer.message$()
    },

    broadcast(data) {
      slaves.forEach(x => {
        peer.send(x, data)
      })
    },

    send(peerId, data) {
      peer.send(peerId, data)
    },

    isConnected() {
      return peer.isConnected()
    },

    connect() {
      peer.connect()

      return this
    },

    disconnect(callback) {
      peer.hangupAll()
      peer.disconnect(callback)
      return this
    }
  }
}
