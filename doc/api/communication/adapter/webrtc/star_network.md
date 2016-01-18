# Star network

In order to enable the webrtc transmissions, and to abstract the PeerJS library, there are two factories. Their API is purposely minimal. However, one might need to extend the existing events in order to have a truly useful event systems.

The key used to connect to the PeerJS server is stored in `/src/client/webrtc/Peer:key`

----

## `MasterPeer()`

> Creates a peer that accepts all incoming connections. The peer will automatically connect to the signalling server.

> This Peer should be used for the Master node of our communication model

Lives in `/src/client/webrtc/MasterPeer`.

### Arguments:
- void

### Result
(Object) exposing the following API :
- `MasterPeer:id()` : gets the id of the peer
- `MasterPeer:message$()` : gets the stream of messages received by the Master. It is an Rx.Observable and the object that can be received in the stream is `{ peerId, message }`
- `MasterPeer:send(peerId, message)` : sends a message to a specific peer that is connected to the Master
- `MasterPeer:broadcast(message)`: sends a message to all the peers connected to the Master
- `MasterPeer:close()`: destroys the peer (super relevant for tests in order not to have to many active connections)
- `MasterPeer:on(event, callback)`: callback called for specific events. The registered events are :
    - `connected` : The master successfully connected to the signalling server

        Callback: `function(id)`
        - `id` is the master's id

    - `disconnected` : The master was disconnected from the signalling server

        Callback: `function()`

    - `slaveConnected` : A slave has connected

        Callback: `function(id)`
        - `id` is the new slave's id

    - `slaveDisconnected` : A slave was disconnected

        Callback: `function(id)`
        - `id` is the new slave's id


----

## `SlavePeer(masterPeerId)`

> Creates a peer that connects to a Master. The peer will connect to the master, disconnect to the signalling server, and refuse any connection from the outside world. Only he is able to connect to a Master.

> This Peer should be used for the Manager, Viewer or Player node of our communication model

Lives in `/src/client/webrtc/SlavePeer`.

### Arguments:
- `masterPeerId` : result of the `MasterPeer:id` method

### Result
(Object) exposing the following API :
- `SlavePeer:id()` : gets the id of the peer
- `SlavePeer:message$()` : gets the stream of messages received by the Slave. It is an Rx.Observable and the object that can be received in the stream is `{ message }`
- `SlavePeer:send(message)` : sends a message to the Master
- `SlavePeer:close()`: destroys the peer (super relevant for tests in order not to have to many active connections)
- `SlavePeer:on(event, callback)`: callback called for specific events. The registered events are :
    - `connected` : The slave successfully connected to the master

        Callback: `function(id)`
        - `id` is the master's id

    - `disconnected` : The slave was disconnected from the master
        Callback: `function()`
