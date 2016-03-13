import React from 'react'
import { Link } from 'react-router'

export default function QuizzList(props) {
  const quizzList = props.list && props.list.length > 0
    ? props.list.map((quizz) => (
      <li key={quizz.key()}>
        {quizz.name()}: <Link to={"/quizz/"+quizz.key()}>Edit</Link>
      </li>
    ))
    : <li>No quizz yet</li>

    return (
      <div>
        Your quizzes :
        <ul>
          {quizzList}
        </ul>
      </div>
    )
}
