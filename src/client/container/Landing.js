import React from 'react'
import { Link } from 'react-router'

/*
 * The landing page allows the user to choose his actions
 * He can either create a new party or join one
 */
export default class Landing extends React.Component {
    render() {
      return <div>
        <div>
          <div>I've got the spirit of a leader:</div>
          <div><Link to="master">Let's party!</Link></div>
        </div>
      </div>
    }
}
