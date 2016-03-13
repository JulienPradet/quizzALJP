import React from 'react'
import { Link } from 'react-router'

export default class Quizz extends React.Component {

  render() {
    return <div>
      <h1><Link to="/quizz">Quizz Management</Link></h1>

      {this.props.children}
    </div>
  }
}
