import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import './styles/SideDrawer.css'

/**
 * Component for rendering mobile menu element
 * Props passed down from MainNavigation.js
 * @param {Object} props
 * @param {String} props.show string for CSSTransition 'in' setting
 * @param {React.ReactNode} props.children passing along props for <button> tag functionality
 * @param {() => void} props.onClick callback function for handling click event (MainNavigation.js)
 * @returns {React.JSX.Element} SideDrawer Element
 */
function SideDrawer(props) {
  const nodeRef = useRef(null)

  const content = (
    <CSSTransition
      nodeRef={nodeRef}
      in={props.show}
      timeout={200}
      classNames='slide-in-left'
      mountOnEnter
      unmountOnExit
    >
      <aside className='side-drawer' onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  )
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
}

export default SideDrawer
