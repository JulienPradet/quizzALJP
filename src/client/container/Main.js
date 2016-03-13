import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import history from '../util/history'

import App from './App'
import Landing from './Landing'

import Manager from './manager/Manager'
import Viewer from './viewer/Viewer'
import Player from './player/Player'

import Quizz from './quizz/Quizz'
import QuizzMenu from './quizz/QuizzMenu'
import QuizzCreator from './quizz/QuizzCreator'
import QuizzEditor from './quizz/QuizzEditor'

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Landing },
  childRoutes: [
    {
      path: 'quizz',
      component: Quizz,
      indexRoute: { component: QuizzMenu },
      childRoutes: [
        { path: 'create', component: QuizzCreator },
        { path: ':quizzKey', component: QuizzEditor }
      ]
    },
    { path: 'manager', component: Manager },
    { path: 'viewer/:masterId', component: Viewer },
    { path: 'player/:masterId', component: Player },
  ]
}

export default function Main() {
  return <Router history={history} routes={routes} />
}
