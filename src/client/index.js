// import launchQuizzTest from './quizz/test'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import history from './util/history'
import App from './container/App'
import Landing from './container/Landing'
import Manager from './container/manager/Manager'
import Viewer from './container/viewer/Viewer'
import Player from './container/player/Player'

function initWebApp() {
  ReactDOM.render(
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Landing} />
        <Route path="manager" component={Manager} />
        <Route path="viewer/:masterId" component={Viewer} />
        <Route path="player/:masterId" component={Player} />
      </Route>
    </Router>,
    document.getElementById('react-container')
  )
}

initWebApp()
