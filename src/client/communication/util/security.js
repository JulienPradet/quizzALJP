export const MESSAGE_TYPE = {
  AUTHENTICATE: 'AUTHENTICATE',
  IS_AUTHENTICATED: 'IS_AUTHENTICATED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED'
}

export const PEER_TYPE = {
  VIEWER: 'VIEWER',
  PLAYER: 'PLAYER',
  MANAGER: 'MANAGER'
}

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
  function _authenticate(token) {
    return {
      isAuthenticated: true,
      newToken: token
    }
  }

  return {
    authenticate(master, peerId, token) {
      const { isAuthenticated, newToken } = _authenticate(token)

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
    }
  }
}
