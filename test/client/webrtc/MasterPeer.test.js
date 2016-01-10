import test from 'tape'
import MasterPeer from '../../../src/client/webrtc/MasterPeer'
import SlavePeer from '../../../src/client/webrtc/SlavePeer'

test('Master should be able to send messages to incoming connections', function(t) {
  const message = 'hello'
  let slave
  let master = MasterPeer()
  master.on('connected', (masterId) => {
    slave = SlavePeer(masterId)
    slave.message$()
      .subscribe(
        function({ message }) {
          t.equal(message, message)
          t.end()
        }
      )
  })
  master.on('slaveConnected', () => {
    master.send(slave.id(), message)
  })
})
