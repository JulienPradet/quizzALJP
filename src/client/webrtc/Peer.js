import { Map } from 'immutable'
import Rx from 'rx'

const key = 'azw18bz9zlz93sor';

/**
 * Simple abstraction over easyrtc in order to only have a simple data channel api
 */
export default function CustomPeer() {
  let peer
  const custom = {}
  const message$ = new Rx.Subject()

  const eventsToFunc = {
    'peer.open': 'openListener',
    'peer.connection': 'peerConnectedListener',
    'peer.call': 'incomingCallListener',
    'peer.close': 'peerDisconnectedListener',
    'peer.disconnected': 'closeListener',
    'peer.error': 'errorListener',
    'conn.open': 'peerConnectedListener',
    'conn.close': 'peerDisconnectedListener',
    'conn.error': 'peerErrorListener'
  }

  /**
   * When the login to the signaling server worked
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#connect successCallback
   */
  function openListener(id) {
    console.log("test")
    if(typeof custom.openListener === "function")
      custom.openListener.apply(this, arguments)
  }

  function closeListener() {
    if(typeof custom.closeListener === "function")
      custom.closeListener.apply(this, arguments)
  }

  function errorListener() {
    if(typeof custom.errorListener === "function")
      custom.errorListener.apply(this, arguments)
  }

  /**
   * When a new connection has been established
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setDataChannelOpenListener listener
   */
  function peerConnectedListener() {
    if(typeof custom.peerConnectedListener === "function")
      custom.peerConnectedListener.apply(this, arguments)
  }

  /**
   * When a connection was closed
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setDataChannelCloseListener listener
   */
  function peerDisconnectedListener() {
    if(typeof custom.peerDisconnectedListener === "function")
      custom.peerDisconnectedListener.apply(this, arguments)
  }

  function peerErrorListener() {
    if(typeof custom.peerErrorListener === "function")
      custom.peerErrorListener.apply(this, arguments)
  }

  /**
   * When a connection was closed
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setPeerListener listener
   */
  function messageListener(peerId, data) {
    console.info("Message received from peer", arguments)
    message$.onNext({ peerId, data })
  }

  function incomingCallListener() {
    if(typeof custom.incomingCallListener === "function") {
      custom.incomingCallListener.apply(this, arguments)
    }
  }

  return {
    /**
     * Get the current Id of the EasyRTC connection
     * @return string unique id of the EasyRTC connection
     */
    id() {
      return peer.id
    },

    message$() {
      return message$
    },

    /**
     * Tests if the peer is connected to the signaling server
     * @return boolean
     */
    isConnected() {
      return !peer.disconnected
    },

    /**
     * Setter for the custom callbacks
     * @return Peer allows to chain functions
     */
    on(eventName, func) {
      if(typeof func === "function") {
        custom[eventsToFunc[eventName]] = func
      }

      return this
    },

    send(peerId, data) {
      activeConnections[peerId].send(data)

      return this
    },

    /**
     * Connect to the easyrtc server
     */
    connect() {
      peer = new Peer({key})
      peer
        .on('open', openListener)
        .on('connection', peerConnectedListener)
        .on('call', incomingCallListener)
        .on('close', peerDisconnectedListener)
        .on('disconnected', closeListener)
        .on('error', errorListener)

      return this
    },

    /**
     * Disconnect from the easyrtc server
     */
    disconnect() {
      peer.disconnect()

      return this
    },

    call(peerId) {
      const conn = peer
        .on('open', peerConnectedListener)
        .on('close', peerDisconnectedListener)
        .on('data', function(data) {
          messageListener(conn.peer, data)
        })
        .on('error', peerErrorListener)
        .connect(peerId)

      return this
    },

    hangup(peerId) {
      const conn = peer.connections[peerId]
      if(conn) conn.close

      return this
    },

    hangupAll() {
      Object.keys(peer.connections).forEach(peerId => this.hangup(peerId))

      return this
    }
  }
}
