import { Map } from 'immutable'
import Peer from './Peer'


export default function SlavePeer() {
  let _masterPeerId = null

  const peer = Peer()
    .set('loginSuccess', function() {
      peer.call(_masterPeerId)
    })
    .set('callSuccess', function(masterPeerId) {
      _masterPeerId = masterPeerId
    })
    .set('callError', function() {

    })
    .set('acceptChecker', function(peerId, acceptor) {
      acceptor(false);
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

    connect(masterPeerId) {
      _masterPeerId = masterPeerId
      peer.connect()
      return this
    },

    disconnect() {
      peer.disconnect()
      return this
    }
  }
}
