import React from 'react'
import './styles/MainHeader.css'

/**
 * Component for rendering main header element
 * Props passed down from MainNavigation.js
 * @param {Object} props
 * @param {React.ReactNode} props.children passing along props for <header> tag functionality
 * @returns {React.JSX.Element} MainHeader Element
 */
function MainHeader(props) {
  return <header className='main-header'>{props.children}</header>
}

export default MainHeader
