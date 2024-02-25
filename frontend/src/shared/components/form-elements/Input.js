import React, { useReducer, useEffect } from 'react'
import { validate } from '../../util/validators'
import './styles/Input.css'

/**
 * Reducer function for modifying state
 * Params passed from Input (below)
 * @param {Object} state
 * @param {String} action string for action.type
 * @returns {Object} state
 */
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      }
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      }
    default:
      return state
  }
}

/**
 * Component for rendering input element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.initialValue string for initial value to set in field
 * @param {Boolean} props.initialIsValid whether initial value is valid (true/false)
 * @param {String} props.id string for setting CSS id
 * @param {String} props.element string to set element type (ex: input or textarea)
 * @param {String} props.type string to set input type (ex: text)
 * @param {String} props.placeholder string to set field placeholder value
 * @param {String} props.rows string to set textarea number of rows
 * @param {String} props.label string to set field label
 * @param {String} props.errorText string to set error message for invalid field entry
 * @param {() => void} props.validators callback function for validation type by field (validators.js)
 * @param {() => void} props.onInput callback function for handling input (form-hook.js)
 * @returns {React.JSX.Element} Input Element
 */
function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialIsValid || false,
  })

  const { id, onInput } = props
  const { value, isValid } = inputState

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput])

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      value: event.target.value,
      validators: props.validators,
    })
  }

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    })
  }

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    )

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  )
}

export default Input
