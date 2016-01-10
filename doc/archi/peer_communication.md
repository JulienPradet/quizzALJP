# Peers

In order to create our real-time quizz, we need to communicate between a few different browsers. However, we must not think in term of browser but in terms of entities that communicate. It will most likely never be actually useful, but it enables us to reason in term of reusability and DRY.

## Diagram
The whole architecture is actually a Star Network. Everyone is communication with the Master, that receives the instructions, treats them, and dispatches the new information.

### Master
The master is the one that is hosting a game. He knows everything about everything. If you were in a Flux application, that would be the store. The single one, in order to apply the principle of *Single source of truth*.

**// TODO reference to the App Container**

He is also the messenger, since he is the one that receive all the messages. For instance, when a Manager want to launch a Quizz, he launches the action by sending a message to the Master. When a player answers a question, he tells the master a message. Etc.

The messages are treated as a queue, as you would expect in any messaging protocol. That's where our use of functional programming becomes really handy. The same series of message should always result in the same state. And thus, we can quite easily add a time travel solution, or refuse an answer of a liar.

When the master has computed a new state, he tells everyone that he has some new state to display. The only information that passes through this signal is the current state type. For instance, it could be that he has just launched a new quizz, a new answer, or that he's anouncing the results of the previous answer.

**// TODO reference the state type API**

### Manager
The manager is the one that will... wait for it... manage the quizz! What that actually mean is that he will be responsible for launching a quizz, passing to the new question, etc. He has extensive privileges on the current game and administrates it.

There should be only one in the network, and his actions/views should not be visible to the players.

**// TODO reference manager actions**

### Viewer
The viewer is a quite dumb one actually. He is only good at being pretty. No actions should be launched from him, and he only displays the current state of the quizz.

He is supposed to be displayed on a white board in the room where the game is held. For now, only one should exist - in order to minimize the exchanges with the master - but since it's a read-only peer, it could be easily multiplied.

### Player
The player is a participant to the quizz. He doesn't have access to a lot of data. That's by design since the only action that he can do is to answer to a question.

Since he could be on a phone, on a TV, or on any support, the information that he displays is scarce and only enables him to answer to the current question. He might actually be able to see his score, but that's all he needs to know.

**// TODO reference answer mechanism**
