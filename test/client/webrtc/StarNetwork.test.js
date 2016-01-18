import test from 'tape'
import MasterPeer from '../../../src/client/communication/adapter/star_network/webrtc/MasterPeer'
import SlavePeer from '../../../src/client/communication/adapter/star_network/webrtc/SlavePeer'

test('Slaves should be able to connect to Master', function(t) {
  let master = MasterPeer()
  let slave
  master.on('connected', (masterId) => {
    slave = SlavePeer(masterId)
  })
  master.on('slaveConnected', () => {
    t.pass('Slave successfully connected')
    slave.close()
    master.close()
    t.end()
  })


})

test('Multiple slaves should be able to connect to Master', function(t) {
  const nbOfSlaves = 3
  let connectedSlaves = 0
  const slaves = []

  let master = MasterPeer()
  master.on('connected', (masterId) => {
    for(let i = 0; i < nbOfSlaves; i++) {
      slaves.push(SlavePeer(masterId))
    }
  })

  master.on('slaveConnected', (id) => {
    connectedSlaves++
    if(nbOfSlaves == connectedSlaves) {
      t.pass('All slaves have successfully connected')
      slaves.forEach(function(slave) { slave.close() })
      master.close()
      t.end()
    }
  })
})

test('Master should be able to send messages to one slave', function(t) {
  const message = 'hello'
  let slave

  let master = MasterPeer()
  master.on('connected', (masterId) => {
    slave = SlavePeer(masterId)
    slave.message$()
      .subscribe(
        function({ message }) {
          t.equal(message, message)
          slave.close()
          master.close()
          t.end()
        }
      )
  })
  master.on('slaveConnected', () => {
    master.send(slave.id(), message)
  })
})

test('Master should be able to broadcast messages to its slaves', function(t) {
  const nbOfSlaves = 3
  const originalMessage = 'hello'
  let connectedSlaves = 0
  let messageReceived = 0
  const slaves = []

  let master = MasterPeer()
  master.on('connected', (masterId) => {
    for(let i = 0; i < nbOfSlaves; i++) {
      const slave = SlavePeer(masterId)
      slaves.push(slave)

      slave.message$().subscribe(
        function({ message }) {
          messageReceived++
          t.equal(message, originalMessage)
          if(messageReceived == nbOfSlaves) {
            slaves.forEach(function(slave) { slave.close() })
            master.close()
            t.end()
          }
        }
      )
    }
  })

  master.on('slaveConnected', (id) => {
    connectedSlaves++
    if(nbOfSlaves == connectedSlaves) {
      master.broadcast(originalMessage)
    }
  })
})

test('Slaves should be able to send a message to Master', function(t) {
  const originalMessage = 'hello'
  const master = MasterPeer()
  let slave
  master.on('connected', (masterId) => {
    slave = SlavePeer(masterId)
  })
  master.on('slaveConnected', () => {
    slave.send(originalMessage)
  })
  master.message$()
    .subscribe(
      function({ peerId, message }) {
        t.equal(peerId, slave.id(), 'message\'s peerId is equal')
        t.equal(message, originalMessage, 'message is equal')
        slave.close()
        master.close()
        t.end()
      }
    )
})
