import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Backdrop from './Backdrop'
import './styles/Modal.css'

/**
 * Component for rendering modal overlay
 * Props passed down from modal function (below)
 * @param {Object} props
 * @param {String} props.style string for setting in-line CSS styling
 * @param {String} props.className string for setting CSS class name
 * @param {String} props.headerClass string for setting CSS class name
 * @param {String} props.header string for header content
 * @param {String} props.contentClass string for setting CSS class name
 * @param {String} props.footerClass string for setting CSS class name
 * @param {String} props.footer string for footer content
 * @param {React.ReactNode} props.children passing along props for <div> tag functionality
 * @param {() => void} props.onSubmit callback function for handling submit event
 * @returns {React.JSX.Element} ModalOverlay Element
 */
function ModalOverlay(props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  )
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

/**
 * Component for rendering modal element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.show string for CSSTransition 'in' setting
 * @param {() => void} props.onCancel callback function for handling click event
 * @returns {Object} containing props passed from various other elements to ModalOverlay (above)
 */
function Modal(props) {
  const nodeRef = useRef(null)

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}

      <CSSTransition
        nodeRef={nodeRef}
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames='modal'
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  )
}

export default Modal
