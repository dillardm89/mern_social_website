import React from 'react'
import ReactDOM from 'react-dom'
import './styles/Backdrop.css'

/**
 * Component for rendering mobile menu backdrop element
 * Props passed down from MainNavigation.js
 * @param {Object} props
 * @param {() => void} props.onClick callback function for handling click event (MainNavigation.js)
 * @returns {React.JSX.Element} Backdrop Element
 */
function Backdrop(props) {
  return ReactDOM.createPortal(
    <div className='backdrop' onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  )
}

export default Backdrop
