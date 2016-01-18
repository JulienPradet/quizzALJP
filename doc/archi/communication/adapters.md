# Adapters

In order to make it easy to change the network layer, we must use some adapters. It might not be the correct word for describing this kind of objects, but it's simply some objects that have the exact same API that are able to communicate with other objects.

Specifically, that will help us when we will have to connect the manager and the master nodes through some service worker. It would be wasteful to use some webRTC connection.

// TODO specify the API

// An apapter might need to have several kind of connections (master node would have webRTC with Viewer/Player and ServiceWorker with Manager)
