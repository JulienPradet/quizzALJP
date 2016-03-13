import { fromJS } from 'immutable'
import Player from '../../communication/Player'
import SlavePeer from '../../communication/adapter/star_network/webrtc/SlavePeer'
import USERS_ACTIONS from '../../constants/users'

/* Listen to the connection of the viewer to the master */
function connection(player, getState, updateState) {
  player.on('connected', () => {
    updateState(getState().set('connected', true))
  })
}

/*
 * Global listener for player's actions
 * The fact that it's in purely functional styles allows it to separate the
 * listeners in multiple files
 * Actions triggered by the player are referenced in the object returned by this
 * function
 */
export default function PlayerManager(masterId) {
  return function PlayerManagerAux(getState = () => {}, updateState = (data) => {}) {
    const player = Player(SlavePeer, masterId)

    connection(player, getState, updateState)

    return {}
  }
}
