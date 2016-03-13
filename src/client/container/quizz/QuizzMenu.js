import React from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'
import { connect } from 'react-redux'

import { readQuizzList, createQuizz, saveQuizzList } from '../../actions/quizz'

import QuizzCreator from './QuizzCreator'
import QuizzList from './QuizzList'
import ImportQuizzForm from './ImportQuizzForm'
import Block from '../../components/ui/Block'

class Quizz extends React.Component {
  componentWillMount() {
    this.props.readList()
  }

  render() {
    return <Block>
      <h2>Menu</h2>
      <QuizzCreator createQuizz={this.props.createQuizz}/>
      <QuizzList list={this.props.quizzList} />
      {/*<ImportQuizzForm />*/}
    </Block>
  }
}

export default connect(
  function(state) {
    return {
      quizzList: state.quizz.list
    }
  },
  function(dispatch) {
    return {
      readList() {
        dispatch(readQuizzList)
      },
      createQuizz(name) {
        dispatch(createQuizz(name))
        dispatch(saveQuizzList)
      }
    }
  }
)(Quizz)
