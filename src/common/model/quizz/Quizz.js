import { Map, List } from 'immutable'
import { InvalidArgumentError } from '../../util/Error/BasicErrors'

import questions from './questions/questions'

/**
 * Factory function for a quizz object
 *
 * The quizz object only contains the definition of the quizz
 * It is composed of a key to identify itself, and a list of steps.
 * A step can be a subquizz (allows to do some sort of pagination of quizz)
 * or a question registered in ./questions/questions.js
 *
 * @param object options : string         key     id of the quizz
 *                         Quizz|Question [steps] steps of the quizz. It can be a subquizz or a question
 * @return Quizz
 */
export default function Quizz(options) {
  if(typeof options === "undefined") {
    throw new InvalidArgumentError('options is required')
  }

  if(!options.hasOwnProperty('key')) {
    throw new InvalidArgumentError('key is undefined')
  }

  /**
   * Steps of the quizz
   * It must be an immutable list of Quizz or Questions
   * If none is defined in options, an empty List is used
   * @const List
   */
  const steps = options.hasOwnProperty('steps') && List.isList(options.steps) ? options.steps : List()

  const name = typeof options.name === 'string' ? options.name : ('Step ' + options.key)

  return {
    /**
     * Get the key of the quizz
     * @return string
     */
    key() { return options.key },

    /**
     * Name that should be displayed to authentify a step
     * @return string
     */
    name() { return name },

    /**
     * Edit the key of the quizz
     * @return Quizz
     */
    setKey(key) {
      return Quizz({
        key: key,
        name: this.name(),
        steps: this.steps()
      })
    },

    /**
     * Edit the name of the quizz
     * @return Quizz
     */
    setName(name) {
      return Quizz({
        key: this.key(),
        name: name,
        steps: this.steps()
      })
    },

    /**
     * Get the remaining steps of the quizz
     * @return List<Quizz|Question>
     */
    steps() { return steps },

    /**
     * Check if key exists in the current quizz
     * @param string key child quizz or question that we're looking for
     * @return boolean
     */
    has(key) {
      return key === this.key()
        ? true
        : this.steps().some(step => typeof step.has === "function" ? step.has(key) : step.key() === key)
    },

    /**
     * Add a step to the quizz (for the building phase of the quizz)
     * @param List<Quizz|Question>|Quizz|Question step(s) to add to the quizz
     * @return Quizz quizz with the new list of steps
     */
    addStep(step) {
      return Quizz({
        key: this.key(),
        name: this.name(),
        steps: List.isList(step) ? this.steps().concat(step) : this.steps().push(step)
      })
    },

    removeStep(stepKey) {
      const res = Quizz({
        key: this.key(),
        name: this.name(),
        steps: this.steps().delete(stepKey)
      })
      return res;
    },

    /**
     * Update a given step
     * @return Quizz with the new step
     */
    setStep(newStep, stepKey) {
      return Quizz({
        key: this.key(),
        name: this.name(),
        steps: this.steps().set(stepKey, newStep)
      })
    },

    /**
     * The step has ended
     * Go to the next one
     * @return Quizz          quizz quizz without the current step
     *         Quizz|Question step  new current step
     */
    nextStep() {
      return {
        step: this.steps().first(),
        quizz: Quizz({
          key: this.key(),
          name: this.name(),
          steps: this.steps().shift()
        })
      }
    },

    toString() {
      return `Quizz(${this.key()} / ${this.steps().count()} step(s))`
    },

    toObject() {
      return {
        key: this.key(),
        name: this.name(),
        steps: this.steps().toArray().map((step) => {
          return step.toObject()
        }),
        type: 'quizz'
      }
    }
  };
}

Quizz.fromObject = function fromObject(object) {
  if(!object.type) {
    return
  }

  if(object.type !== 'quizz') {
    return questions.fromObject(object)
  }


  return Quizz({
    key: object.key,
    name: object.name,
    steps: new List(object.steps.map((step) => Quizz.fromObject(step)))
  })
}
