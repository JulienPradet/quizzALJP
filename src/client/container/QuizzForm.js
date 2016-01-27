import React from 'react'
import QuizzFormManager from './QuizzFormManager'
import Quizz from '../../common/model/quizz/Quizz'
import QuizzStepForm from '../components/quizz/QuizzStepForm'

export default class QuizzForm extends React.Component {
  constructor(props) {
    super(props)

    console.log(props);
    if(props.hasOwnProperty('quizz')) {
      this.state = { quizz: props.quizz }
    } else if(props.hasOwnProperty('quizzKey')) {
      this.state = {
        quizz: new Quizz({
          key: props.quizzKey
        })
      }
    } else {
      throw new Error('A key must be defined.')
    }
  }

  componentWillMount() {
    this.actions = QuizzFormManager(
      () => this.state.quizz,
      (quizz) => this.setState({quizz})
    )
  }

  render() {
    return <div>
      Form that enables the user to create a new Quizz
      Should have some Save/Reset button

      <form onSubmit={this.actions.save}>
        <QuizzStepForm key={this.state.quizz.key()} step={this.state.quizz} onUpdate={this.actions.update}/>
      </form>
    </div>
  }
}
