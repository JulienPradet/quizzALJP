// import launchQuizzTest from './quizz/test'
import launchWebRtcTest from './webrtc/test'
import React from 'react'
import ReactDOM from 'react-dom'
import QuizzCreator from './container/QuizzCreator'

//launchTest()
launchWebRtcTest()

ReactDOM.render(
  <QuizzCreator />,
  document.getElementById('reactContainer')
)
