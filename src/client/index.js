import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from './reducers'

import Main from './container/Main'

function configureStore() {
  const store = createStore(
    rootReducer
  )

  if(module.onReload) {
    module.onReload(() => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer.default || nextReducer);

      return true;
    })
  }

  return store
}

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('react-container')
)
