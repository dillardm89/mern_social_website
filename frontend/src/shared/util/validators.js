const VALIDATOR_TYPE_REQUIRE = 'REQUIRE'
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH'
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH'
const VALIDATOR_TYPE_MIN = 'MIN'
const VALIDATOR_TYPE_MAX = 'MAX'
const VALIDATOR_TYPE_EMAIL = 'EMAIL'
const VALIDATOR_TYPE_FILE = 'FILE'

/**
 * @exports VALIDATOR_REQUIRE Function to set input field type as 'Required'
 */
export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE })

/**
 * @exports VALIDATOR_FILE Function to set input field type as 'File'
 */
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE })

/**
 * @param {Int} value number for minimum length required in field
 * @exports VALIDATOR_MINLENGTH Function to set input field type as 'Minlength'
 */
export const VALIDATOR_MINLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  value: value,
})

/**
 * @param {Int} value number for maximum length required in field
 * @exports VALIDATOR_MAXLENGTH Function to set input field type as 'Maxlength'
 */
export const VALIDATOR_MAXLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  value: value,
})

/**
 * @param {Int} value number for minimum required in field
 * @exports VALIDATOR_MIN Function to set input field type as 'Min'
 */
export const VALIDATOR_MIN = (value) => ({
  type: VALIDATOR_TYPE_MIN,
  value: value,
})

/**
 * @param {Int} value number for maximum required in field
 * @exports VALIDATOR_MAX Function to set input field type as 'Max'
 */
export const VALIDATOR_MAX = (value) => ({
  type: VALIDATOR_TYPE_MAX,
  value: value,
})

/**
 * @exports VALIDATOR_EMAIL Function to set input field type as 'Email'
 */
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL })

/**
 * Function for validating input fields based on type
 * Params passed down from Input.js
 * @param {String} value string containing input field data (event.target.value)
 * @param {() => void} validators callback function for validation type by field (from above)
 * @returns {Boolean} isValid whether input passes validation checks (true/false)
 */
export const validate = (value, validators) => {
  let isValid = true
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.value
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.value
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.value
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.value
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value)
    }
  }
  return isValid
}
