import React from 'react'
import { Link } from 'react-router'

export default class Login extends React.Component {
    render() {
      return <div>
        <div>
          <div>I've got the spirit of a leader:</div>
          <div><Link to="master">Let's party!</Link></div>
        </div>
      </div>
    }
}
