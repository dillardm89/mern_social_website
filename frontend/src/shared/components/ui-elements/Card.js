import React from 'react'
import './styles/Card.css'

/**
 * Component for rendering card element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.className string for setting CSS class name
 * @param {String} props.style string for setting in-line CSS styling
 * @param {React.ReactNode} props.children passing along props for <card> tag functionality
 * @returns {React.JSX.Element} Card Element
 */
function Card(props) {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  )
}

export default Card
