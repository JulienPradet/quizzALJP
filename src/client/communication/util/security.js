import MESSAGE_TYPE from '../../constants/security'

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

  function _authenticate(token, type) {
    loggedIn[token] = type
    return {
      isAuthenticated: true,
      newToken: token
    }
  }

  return {
    authenticate(master, peerId, type, token) {
      const { isAuthenticated, newToken } = _authenticate(token, type)

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
    }
  }
}
