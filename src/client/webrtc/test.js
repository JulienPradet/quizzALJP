import SlavePeer from './SlavePeer'
import MasterPeer from './MasterPeer'

export default function launchTest() {
  let currentPeer;

  function disconnectFromCurrent(callback) {
    if(typeof currentPeer !== "undefined" && currentPeer !== null) {
      currentPeer.disconnect(callback)
    } else {
      callback()
    }
  }

  document.getElementById('launch-slave')
    .onclick = function launchSlave() {
      disconnectFromCurrent(function connectToSlave() {
        const masterPeerId = document.getElementById('master-peer-id').value

        console.log("Launch Slave")

        currentPeer = SlavePeer()
        currentPeer.connect(
          masterPeerId,
          function loginSlaveSuccess(peerId) {
            console.info('Slave id: '+peerId)
          },
          function loginSlaveFailure() {
            console.error('Failed to connect')
          }
        )
      })
    }

  document.getElementById('launch-master')
    .onclick = function launchMaster() {
      disconnectFromCurrent(function connectToMaster() {
        console.log("Launch Master")

        currentPeer = MasterPeer()
        currentPeer.connect(
          function loginMasterSuccess(peerId) {
            console.inf('Master id: '+peerId)
          },
          function loginMasterFailure() {
            console.error('Failed to connect')
          }
        )
      })
    }
}
