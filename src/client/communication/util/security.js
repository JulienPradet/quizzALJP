import MESSAGE_TYPE from '../../constants/security'
import PEER_TYPE from '../../constants/peers'

export function login(peer, type, token) {
  peer.send(
    MESSAGE_TYPE.AUTHENTICATE,
    {
      type: type,
      token: token
    }
  )
}

export function Authenticator() {
  const loggedIn = {}

  /* Boolean that tells if players can connect to the master or not */
  let authorizePlayers = false;

  function _authenticate(token, type) {
    loggedIn[token] = type
    return {
      isAuthenticated: (type !== PEER_TYPE.PLAYER || authorizePlayers),
      newToken: token
    }
  }

  return {
    authenticate(master, peerId, type, token) {
      const { isAuthenticated, newToken } = _authenticate(token, type)
      console.log(isAuthenticated, type, authorizePlayers)

      if(isAuthenticated) {
        master.send(
          peerId,
          MESSAGE_TYPE.IS_AUTHENTICATED,
          {
            token: newToken
          }
        )
      } else {
        master.send(
          peerId,
          MESSAGE_TYPE.AUTHENTICATION_FAILED,
          {}
        )
      }

      return isAuthenticated
    },
    isAuthenticated(token) {
      return {
        valid: loggedIn.hasOwnProperty(token),
        type: loggedIn[token]
      }
    },
    openToPlayers() {
      authorizePlayers = true;
    },
    closeToPlayers() {
      authorizePlayers = false;
    }
  }
}
