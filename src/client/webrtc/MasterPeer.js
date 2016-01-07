import Rx from 'rx'
import { key } from './Peer'

export default function MasterPeer() {
  const message$ = new Rx.Subject()

  const peer = new Peer({ key })
    .on('open', function(id) {
      console.info('Master: Connected '+id)
    })
    .on('disconnected', function() {
      console.info('Master: Disconnected')
    })
    .on('connection', function(conn) {
      console.info('Master: Slave connecting '+conn.peer)
      conn
        .on('open', function() {
          console.info('Master: Slave connected '+conn.peer)
          conn.send({
            type: 'hello',
            message: 'hi slave'
          })
        })
        .on('data', function(data) {
          console.info('Master: Message received from '+conn.peer)
          message$.onNext({ peerId: conn.peer, data: data })
        })
        .on('close', function() {
          console.log('Master: Slave disconnected '+conn.peer)
        })
        .on('error', function() {
          console.err('Master : Error', arguments)
        })
    })
    .on('close', function() {
      console.info('Master: Closing')
    })
    .on('error', function(err) {
      console.error('Master: Error', err)
    })

  function broadcast(data) {
    for(var peerId in peer.connections) {
      peer.connections.forEach(function(conn) {
        conn.send(data)
      })
    }

    return this
  }

  function send(peerId, data) {
    peer.connections[peerId].forEach(function(conn) {
      conn.send(data)
    })

    return this
  }

  return {
    message$() {
      return message$
    },
    broadcast,
    send
  }
}
