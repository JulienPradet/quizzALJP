import { Map } from 'immutable'
import Peer from './Peer'


export default function SlavePeer() {
  let _masterPeerId = null

  const peer = Peer()
    .on('peer.open', function() {
      console.info('Slave: Connected. Attempting to connect to master.')
      peer.call(_masterPeerId)
    })
    .on('peer.disconnected', function() {
      console.info('Slave: Disconnected')
    })
    .on('peer.connection', function(conn) {
      console.info('Slave: New peer connected: '+conn.peer)
    })
    .on('peer.call', function(conn) {
      console.info('Slave: Refuse connection: '+conn.peer)
      conn.close();
    })
    .on('peer.close', function() {
      console.info('Slave: Closing')
    })
    .on('peer.error', function(err) {
      console.error('Slave: Error', err)
    })

  return {
    message$() {
      return peer.message$()
    },

    send(msgType, msgData) {
      peer.master(_masterPeerId, msgType, msgData)
    },

    isConnected() {
      return master !== null
    },

    connect(masterPeerId, loginSuccess, loginFailure) {
      if(!!masterPeerId) {
        _masterPeerId = masterPeerId
        peer.connect()
        return this
      } else {
        console.warn('No peer id given')
      }
    },

    disconnect(callback) {
      peer.hangup(_masterPeerId)
      peer.disconnect(callback)
      return this
    }
  }
}
