import { List } from 'immutable'
import Peer from './Peer'


export default function MasterPeer() {
  const slaves = List().asMutable()

  const peer = Peer()
    .set('openListener', function(easyRtcId) {
      slaves.push(easyRtcId)
    })
    .set('closeListener', function(easyRtcId) {
      const index = slaves.find(x => c === easyRtcId)
      if(index > -1) {
        slaves.delete(index)
      }
    })
    .set('acceptChecker', function(peerId, acceptor) {
      acceptor(true);
    })

  return {
    message$() {
      return peer.message$()
    },

    broadcast(msgType, msgData) {
      slaves.forEach(x => {
        peer.send(x, msgType, msgData)
      })
    },

    send(peerId, msgType, msgData) {
      peer.send(peerId, msgType, msgData)
    },

    isConnected() {
      return peer.isConnected()
    },

    connect(loginSuccess, loginFailure) {
      peer.connect(
        loginSuccess,
        loginFailure
      )
      return this
    },

    disconnect(callback) {
      peer.hangupAll()
      peer.disconnect(callback)
      return this
    }
  }
}
