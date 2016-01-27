# Authentication

In order to manage the users there is a simple security layer.
When a peer connects to the master, he requests a connection by sending a simple
message.

The authenticator is defined in `src/client/communication/util/security.js`.
The helper function `login` sends a message to the master that launches the
login handshake.

As soon as the master accepts the connection, he sends back a message that tells
if it was a success.

TODO :
- Make it possible to block the authentications
- Make it possible to reconnect easily (by using a token)
