# App State

In a typical React application, one can use Flux, as suggested by Facebook. The most popular library doing so outthere is Redux. However, we think there is no need to go through another lib. Indeed, React already has its own state management. By using it, we're able to take advantage of React Component's lifecycle but are still able to decouple our business logic.

## React Containers

> Use as few React Containers as possible

A react container is one that is state aware. Indeed, in order to keep things clean, we try to dispatch the managers as few as possible. Thus, there is usually one big container that have access to all the data. And the children are as dumb as possible, using callbacks to trigger some actions directly on the parent container.

## Decoupling the logic

> Get out of React in order to prepare our road out of it

As everyone know, the front-end landscape is an ever changing dream/nightmare. Thus, let's use as few libraries as possible, and especially, let's choose our code architecture in order to be able to change components quite easily.

Our first step toward that is to simply get our stuff out of those libs. Here, that means that the state managers of our React containers are completly decoupled from the React logic.

In our apps, they are `Managers`. They are able to manage the app lifecycle, get access to the current state, and notify the changes back to the containers. Typically, in a React environnement, that would be initialized in the `componentWillMount` method, like so :

```javascript
Manager(
  () => this.state,
  this.setState
)
```

The main Manager function is actually an empty shell that calls other functions that host the logic. It can also return an object that represents the list of actions that can be acheived by this listener. For instance, if we are willing to listen to incoming connections, it would look like :

```javascript
function connections(getState, updateState) {
  messageStream
    .filter({ type } => type === 'NEW_CONNECTION')
    .subscribe(() => {
      updateState(
        getState()
          .set(
            'number_of_connections',
            getState().get('number_of_connections') + 1
          )
      )
    })
}

Manager(getState, updateState) {
  connections(getState, updateState)

  return {
    disconnectAll() {
      updateState(
        getState().set('number_of_connections', 0)
      )
    }
  }
}
```

As you might have seen in this example, there are two more things to say :

- We use **immutable** data structures in order to avoid side effects. That's how we are able to avoid any unpredictable behavior of our app and how we simplify the mental model of our global state. The library we're using for that is `immutable.js`. // TODO Reference immutability

- We try to use as much **stream** handlers as possible in order to simplify the mental model of the asynchrony events that occur in our app. That's particularly useful since we've got 4 different types of nodes communicating between eachother and we wouldn't be able to predict every single event stream. The declarative way suggested by libraries like `RxJS` makes it easier. // TODO Reference RxJS
