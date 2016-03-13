import React from 'react'
import { Link } from 'react-router'

import Block from '../components/ui/Block'

/*
 * The landing page allows the user to choose his actions
 * He can either create a new party or join one
 */
export default class Landing extends React.Component {
    render() {
      return <div>
        <h1>
          Welcome to the QuizzALJP !
        </h1>

        <Block>
          <div>First, you need to manage your available quizz.</div>
          <div><Link to="quizz">Manage my quizz</Link></div>
        </Block>

        <Block>
          <div>You can then host a party</div>
          <div><Link to="manager">Let's party!</Link></div>
        </Block>
      </div>
    }
}
