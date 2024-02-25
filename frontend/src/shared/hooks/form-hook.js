import { useCallback, useReducer } from 'react'

/**
 * Reducer function for modifying state
 * Params passed from useForm (below)
 * @param {Object} state
 * @param {String} action string for action.type
 * @returns {Object} state
 */
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true

      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      }
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      }
    default:
      return state
  }
}

/**
 * Hook function for handling forms to load initial data (UpdatePlace.js)
 * and/or handling form submit event (Auth.js, UpdatePlace.js, NewPlace.js)
 * @param {Object} initialInputs autofill form fields if data exists
 * @param {Boolean} initialFormValidity autofill form validity status if data exists
 * @returns {Object} formState contains initial form data if exists
 * @returns {() => void} inputHandler callback to method
 * @returns {() => void}  setFormData callback to method
 */
export function useForm(initialInputs, initialFormValidity) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  })

  /**
   * Form method to handle input state change
   * @method inputHandler
   * @param {String} id string for input field id
   * @param {String} value string for input field value (event.target.value)
   * @param {Boolean} isValid whether field passes validation tests (validators.js)
   */
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    })
  }, [])

  /**
   * Form method to handle set state
   * @method setFormData
   * @param {Object} inputData object containing data for each input field (id, value, isValid)
   * @param {Boolean} formValidity whether all form fields pass validation tests
   */
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    })
  }, [])

  return [formState, inputHandler, setFormData]
}
