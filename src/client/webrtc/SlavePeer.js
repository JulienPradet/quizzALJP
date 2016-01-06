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
      console.info('callSuccess')
    })
    .set('callError', function() {
      console.info('callFailure')
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
