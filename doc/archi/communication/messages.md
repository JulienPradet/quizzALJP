# Messages

There are many actions triggered by the different nodes involved in our architecture. And each one of them triggers at least 2 messages that make it clear for each node what does he have to do next.

## Message structure

In order to define the messages we use a data structure that defines :
- a **type** that tells what kind of message it is
- some **data** that brings more detailed information about the ongoing action

The type must be a constant referenced in `src/client/constants`. Each action should be unique in order to avoid conflicts. It can either be acheived by a *namespace like* string style, or by using *Symobols* in javascript. There is currently no decision made about this. However, each sets of actions should at least be in separate files in order to improve readability.

The data structure has to be in default javascript. It is then passed through the network in a JSON format, and converted back once received by the node. While it is always important to keep immutable data structure, if some nodes have some read-only behaviors, don't bother with reversing it back to a trully immutable object.

There can be one more data passed in the messages : it is the node id. Indeed, if a node is connected to many, it is important to know where does the message come from. The key used is **peerId**

## Trigger updates

It is important not to make assumptions about the updates mecanism and to be trully reactive. Thus, when an update mecanism has to be triggered, it should be sent to every single node in the system. Then, the nodes will decide if it's useful for them or not.

It allows use to add a new kind of node without ever worry about its function for the core nodes.

Furthermore, when signalling a new update, don't assume everyone wants the same data. It would make the network bloated by sending unnecessary data. Thus, once a node receives an update notification, it then triggers a message that asks only for the specific resources it needs.
