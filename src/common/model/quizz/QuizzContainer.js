import { Map, List } from 'immutable'
import { InvalidArgumentError } from '../../util/Error/BasicErrors'
import Quizz from './Quizz'

/**
 * Helper function that create a tree of QuizzContainers depending of the tree of quizz given
 * @param Quizz quizz to mirror with QuizzContainers
 * @return List<QuizzContainer> might be empty if there are only Questions in the quizz's steps
 */
function buildSubContainerFromQuizz(quizz) {
  return quizz.steps()
    .filter(step => step.hasOwnProperty('steps'))
    .map(step => QuizzContainer({ quizz }));
}

/**
 * A QuizzContainer contains the quizz and the current state of the result
 *
 * It has the same form of tree as the quizz it describes
 * The answers are not stored - since they are stored in the questions of the quizz
 * However, the points given by the answers are stored in the result.
 *
 * The result contains the result of the direct answers added to all the results of subQuizz
 *
 * @param object options : Quizz                quizz        Quizz that is handled by the container
 *                         List<QuizzContainer> subContainer SubContainers for the subQuizz of the quizz
 *                         Map<string, integer> result       Current result of the quizz
 */
export default function QuizzContainer(options) {
  if(typeof options === "undefined") {
    throw new InvalidArgumentError('options is mandatory')
  }

  if(!options.hasOwnProperty('quizz')) {
    throw new InvalidArgumentError('quizz is undefined')
  }

  /**
   * The quizz used in the container
   * @const Quizz
   */
  const quizz = options.quizz

  /**
   * The subContainers that match the steps of the quizz which are Quizz themselves
   * @const List<QuizzContainer>
   */
  const subContainer = options.hasOwnProperty('subContainer') && List.isList(options.subContainer)
    ? options.subContainer
    : buildSubContainerFromQuizz(quizz)

  /**
   * The current result of the quizz
   * Maps pointKeys (id of the player) and the points received
   * @const Map<string, integer>
   */
  const result = options.hasOwnProperty('result') ? options.result : Map()

  return {
    /**
     * Get the quizz
     * @return Quizz
     */
    quizz() { return quizz },

    /**
     * Get the list of subContainers
     * @return List<QuizzContainer>
     */
    subContainer() { return subContainer },

    /**
     * Get the current result of the quizz
     * @return Map<string, integer>
     */
    result() { return result },

    /**
     * Answer a quizz and update the points
     * @param integer questionKey id of the question answered
     * @param integer pointKey    id where to update the points
     * @param string  answer      answer suggested for the question
     * @return Quizz          quizz     Updated quizz
     *         QuizzContainer update    Result to dispatch through the results of the current quizz
     *         boolean        isCorrect Tells if the answer was correct or not
     */
    answer(questionKey, pointKey, answer) {
      let result = Map()
      let isCorrectResult = false
      let steps = this.quizz().steps()

      /*
       * Go through each step and check if the answer is for its question(s)
       * If it does, update the points, and spread it upward
       */
      this.quizz().steps()
        .forEach((step, stepKey) => {
          if(step.key() === questionKey) {
            /* If it's a question and the key is the same : check the answer and update quizz */
            const { question, points, isCorrect } = step.isCorrect(answer, pointKey);

            result = result.set(pointKey, points)
            steps = steps.set(stepKey, question)
            isCorrectResult = isCorrectResult || isCorrect
          } else if(typeof step.answer === "function") {
            /* If it's a subQuizz, update the subQuizz and affect the current one */
            const { quizz, update, isCorrect } = step.answer(questionKey, pointKey, answer);

            result = result.mergeWith((x, y) => x + y, update)
            steps = steps.set(stepKey, quizz)
            isCorrectResult = isCorrectResult || isCorrect
          }
        })

      return {
        quizzContainer: QuizzContainer({
          quizz: Quizz({
            key: this.quizz().key(),
            steps: steps,
          }),
          result: this.result().mergeWith((x, y) => x + y, result)
        }),
        update: result,
        isCorrect: isCorrectResult
      }
    }
  }
}
