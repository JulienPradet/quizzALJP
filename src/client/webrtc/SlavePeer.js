import Rx from 'rx'
import { key } from './Peer'


export default function SlavePeer(masterPeerId) {
  const message$ = new Rx.Subject()
  let conn

  const peer = Peer({ key })
    .on('open', function() {
      console.info('Slave: Connected. Attempting to connect to master.')

      conn = peer.connect(masterPeerId)
        .on('data', function(data) {
          console.info('Master: Message received from '+conn.peer)
          message$.onNext({ peerId: conn.peer, data: data })
        })
        .on('open', function() {
          console.info('Slave: Connected to master')
          conn.send({
            type: 'hello',
            message: 'hi master'
          })
        })
        .on('close', function() {
          console.log('Slave: Lost connection to master')
        })
        .on('error', function() {
          console.err('Slave: Error', arguments)
        })
    })
    .on('disconnected', function() {
      console.info('Slave: Disconnected')
    })
    .on('connection', function(conn) {
      console.info('Slave: New peer attempted to connect: '+conn.peer)
      console.warn('Rejecting peer')
      conn.close()
    })
    .on('close', function() {
      console.info('Slave: Closing')
    })
    .on('error', function(err) {
      console.error('Slave: Error', err)
    })

  function send(data) {
    conn.send(masterPeerId, data)
  }

  return {
    message$() {
      return message$
    },
    send
  }
}
