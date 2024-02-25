import React from 'react'
import Modal from './Modal'
import Button from '../form-elements/Button'

/**
 * Component for rendering error modal element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.error string for error message
 * @param {() => void} props.onClear callback function for clearing modal (http-hook.js)
 * @returns {React.JSX.Element} ErrorModal Element
 */
function ErrorModal(props) {
  return (
    <Modal
      onCancel={props.onClear}
      header='An Error Occurred!'
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  )
}

export default ErrorModal
