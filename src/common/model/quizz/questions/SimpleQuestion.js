import { InvalidArgumentError } from '../../../util/Error/BasicErrors'
import { Map } from 'immutable'

/**
 * SimpleQuestion for a quizz
 *
 * Default behavior :
 *    Single winner with 1 point
 *    A bad answer is negative point
 *    One pointKey can submit an answer only once
 *
 * @param object options : string              key                Unique identifier of the question (must be unique including the quizz keys)
 *                         string              title              Title of the question
 *                         string              answer             Answer of the question
 *                         integer             [availablePoints]  AvailablePoints for the question : should begin with 1
 *                         Map<string, string> [suggestedAnswers] Map of answers by pointKey
 * @return SimpleQuestion which is immutable
 * @throws InvalidArgumentError when no options given or key, title or answer is missing
 */
export default function SimpleQuestion(options) {
  if(typeof options === "undefined")
    throw new InvalidArgumentError('options is required')

  if(!options.hasOwnProperty('key') || !options.hasOwnProperty('title') || !options.hasOwnProperty('answer'))
    throw new InvalidArgumentError('Key, Title or Answer is undefined')

  /**
   * AvailablePoints of the question
   * Allows to know if the next correct answer should give some points or not
   * @const integer availablePoints
   */
  const availablePoints = options.hasOwnProperty('availablePoints') ? options.availablePoints : 1

  return {
    /**
     * Get the key of the question
     * @return string key of the question
     */
    key() { return options.key },

    /**
     * Get the title of the question
     * @return string title of the question
     */
    title() { return options.title },

    /**
     * Get the valid answer of the question
     * @return string answer of the question
     */
    answer() { return options.answer },

    /**
     * Get all the answers to the question
     * Only the first answer should be registered for each pointKey
     * @return Map<string, string> Map(pointKey, givenAnswer)
     */
    suggestedAnswers() {
      return options.hasOwnProperty('suggestedAnswers') && Map.isMap(options.suggestedAnswers)
        ? options.suggestedAnswers
        : Map()
    },

    /**
     * Answer to a question and get the number of points provided by this question
     *
     * The point of this function is to know how many points should a question give,
     * and to update it, in order to devaluate the number of points given to the next
     * answer. Thus, if only the first is valid, the next ones won't win any point
     *
     * @param string  answer to the question
     * @param integer id of the impacted user
     * @return SimpleQuestion question  the updated question
     *         integer        points    the number of points given to the answer
     *         boolean        isCorrect the boolean that tells if the answer is right
     */
    isCorrect(answer, pointKey) {
      const isCorrect = this.answer().localeCompare(answer) === 0
      const answerPoint = this.suggestedAnswers().has(pointKey) // If the user has already answered, no point to update
        ? 0
        : isCorrect // If the user is correct, give the points only if there are available points
          ? availablePoints > 0
            ? 1 // Give one point per correct answer (use this.availablePoints if you want to only have one winner)
            : 0
          : -1 // Give negative points if the user fails

      return {
        question: SimpleQuestion({
          key: this.key(),
          title: this.title(),
          answer: this.answer(),
          availablePoints: availablePoints - (answerPoint > 0 ? answerPoint : 0),
          suggestedAnswers: this.suggestedAnswers().has(pointKey) ? this.suggestedAnswers() : this.suggestedAnswers().set(pointKey, answer)
        }),
        points: answerPoint,
        isCorrect: isCorrect
      };
    },

    toString() {
      return `SimpleQuestion(${this.key()} / ${this.title()})`
    },

    toObject() {
      return {
        key: this.key(),
        title: this.title(),
        answer: this.answer(),
        type: 'simpleQuestion'
      }
    }
  }
}

SimpleQuestion.fromObject = function fromObject(object) {
    return SimpleQuestion({
      key: object.key,
      title: object.title,
      answer: object.answer
    })
}
