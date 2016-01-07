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

        console.info("Launch Slave")
        currentPeer = SlavePeer(masterPeerId)
        listenToCurrentPeer()
      })
    }

  document.getElementById('launch-master')
    .onclick = function launchMaster() {
      disconnectFromCurrent(function connectToMaster() {
        console.info("Launch Master")
        currentPeer = MasterPeer()
        listenToCurrentPeer()
      })
    }

  function listenToCurrentPeer() {
    currentPeer.message$()
      .subscribe(
        function(data) {
          console.log(data)
        },
        function() {
          console.error(arguments)
        },
        function() {
          console.info(arguments)
        }
      )
  }
}
