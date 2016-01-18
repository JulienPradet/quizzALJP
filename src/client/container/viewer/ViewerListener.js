import USERS_ACTIONS from '../../constants/users'
import { fromJS } from 'immutable'

/* Listen to the connection of the viewer to the master */
function connection(viewer, getState, updateState) {
  viewer.on('connected', () => {
    updateState({data: getState().data.set('connected', true)})
  })
}

function requestUsers(viewer) {
  return function() {
    viewer.send(USERS_ACTIONS.GET_ALL, {})
  }
}

/* Update the list of users since the list has been received from the master */
function updateUsers(viewer, getState, updateState) {
  // Should update ?
  viewer.message$
    .filter(({ type }) => {
      return type === USERS_ACTIONS.USERS_HAS_UPDATED
    })
    .subscribe(() => {
      requestUsers(viewer)()
    })

  // Manage state updates
  viewer.message$
    .filter(({ type }) => {
      return type === USERS_ACTIONS.ALL
    })
    .subscribe(({ type, data }) => {
      updateState({ data: getState().data.set('users', data)})
    })
}

/*
 * Global listener for viewer's actions
 * The fact that it's in purely functional styles allows it to separate the
 * listeners in multiple files
 * Actions triggered by the viewer are referenced in the object returned by this
 * function
 */
export default function ViewerListener(viewer, getState, updateState) {
  connection(viewer, getState, updateState)
  updateUsers(viewer, getState, updateState)

  return {
    requestUsers: requestUsers(viewer)
  }
}
