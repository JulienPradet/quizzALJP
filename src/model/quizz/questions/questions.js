import SimpleQuestion from './SimpleQuestion'

/**
 * Container of the list of available questions in the app
 * Allows to build some external questions and easily include them in the project
 *
 * Default questions are :
 *   - SimpleQuestion
 *
 * A Question is defined by the fact that it must have at least the following functions :
 *   - key(void): string : returns the unique id of the question
 *   - isCorrect(answer: any, pointKey: string): object : checks if the given answer is
 *                                                        correct, gives the number of
 *                                                        points won and update the question
 * The QuestionFactory must take as arguments only one, named options. It's content is free.
 *
 * @const key: string, value: function (factory of the question)
 */
const questionFactoryList = {
  simpleQuestion: SimpleQuestion,
}

export default {
  /**
   * Gets the factory function of the questionType
   * @return QuestionFactory|undefined
   */
  get(questionType) {
    if(questionFactoryList.hasOwnProperty(questionType)) {
      return questionFactoryList[questionType];
    }
  },

  /**
   * Add a question factory to the questionFactoryList
   * @return QuestionFactory if it succeeded, undefined otherwise
   */
  add(questionType, factory) {
    if(typeof factory === 'function') {
      questionFactoryList.questionType = factory;
      return factory;
    }
  }
}
