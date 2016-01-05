import { Map } from 'immutable'
import easyrtc from 'easyrtc'

/**
 * Simple abstraction over easyrtc in order to only have a simple data channel api
 */
export function Peer() {
  let _easyRtcId = null
  const custom = {}
  const message$ = new Rx.Subject()

  /**
   * When the login to the signaling server worked
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#connect successCallback
   */
  function loginSuccess(easyRtcId) {
    _easyRtcId = easyRtcId
    if(typeof custom.loginSuccess === "function")
      custom.loginSuccess.apply(this, arguments)
  }

  /**
   * When the login to the signaling server failed
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#connect errorCallback
   */
  function loginFailure() {
    _easyRtcId = null
    if(typeof custom.loginFailure === "function")
      custom.loginFailure.apply(this, arguments)
  }

  function disconnectListener() {
    _easyRtcId = null
  }

  /**
   * When a new connection has been established
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setDataChannelOpenListener listener
   */
  function openListener() {
    if(typeof custom.openListener === "function")
      custom.openListener.apply(this, arguments)
  }

  /**
   * When a connection was closed
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setDataChannelCloseListener listener
   */
  function closeListener() {
    if(typeof custom.closeListener === "function")
      custom.closeListener.apply(this, arguments)
  }

  /**
   * When a connection was closed
   * @see https://www.easyrtc.com/docs/browser/easyrtc.php#setPeerListener listener
   */
  function messageListener() {
    console.info("Message received from peer", arguments)
    message$.onNext(peerId, msgType, msgData)
  }

  function acceptChecker() {
    if(typeof custom.acceptChecker === "function") {
      custom.acceptChecker.apply(this, arguments)
    }
  }

  return {
    /**
     * Get the current Id of the EasyRTC connection
     * @return string unique id of the EasyRTC connection
     */
    id() {
      return _easyRtcId
    },

    message$() {
      return message$
    },

    /**
     * Tests if the peer is connected to EasyRTC
     * @return boolean
     */
    isConnected() {
      return easyrtc.getConnectStatus()
    },

    /**
     * Setter for the custom callbacks
     * @return Peer allows to chain functions
     */
    set(callbackName, func) {
      if(typeof func === "undefined") {
        custom[callbackName] = func
      }
      return this
    },

    send(peerId, msgType, msgData) {
      easyrtc.sendDataP2P(peerId, msgType, msgData)
      return this
    },

    /**
     * Connect to the easyrtc server
     */
    connect() {
      if(!this.isConnected()) {
        easyrtc.enableDebug(true)
        easyrtc.enableDataChannels(true)
        easyrtc.enableVideo(false)
        easyrtc.enableAudio(false)
        easyrtc.enableVideoReceive(false)
        easyrtc.enableAudioReceive(false)

        easyrtc.setDataChannelOpenListener(openListener)
        easyrtc.setDataChannelCloseListener(closeListener)
        easyrtc.setPeerListener(messageListener)
        easyrtc.setAcceptChecker(acceptChecker)

        easyrtc.setDisconnectListener(disconnectListener)
        easyrtc.connect("aljp.quizz", loginSuccess, loginFailure)
      }

      return this
    },

    /**
     * Disconnect from the easyrtc server
     */
    disconnect() {
      if(this.isConnected()) {
        easyrtc.disconnect()
      }

      return this
    },

    call(peerId) {
      if (easyrtc.getConnectStatus(peerId) === easyrtc.NOT_CONNECTED) {
        try {
          easyrtc.call(peerId,
            function successCall(caller, media) { // success callback
              if (media === 'datachannel') {
                console.info('Connected to '+peerId)
                if(typeof custom.callSuccessful === "function") {
                  custom.callSuccess(caller)
                }
              }
            },
            function errorCall(errorCode, errorMessage) {
              console.error('Impossible to connect to '+peerId, errorCode, errorMessage)
              if(typeof custom.callSuccessful === "function") {
                custom.callError(peerId, errorCode, errorMessage)
              }
            }
          );
        } catch(callerror) {
          console.error('Impossible to connect to '+peerId)
          console.error(callerror)
        }
      } else {
        console.warn('Already connected to '+peerId)
      }
    },

    hangup(peerId) {
      easyrtc.hangup(peerId)
      return this
    },

    hangupAll() {
      easyrtc.hangupAll()
      return this
    }
  }
}
