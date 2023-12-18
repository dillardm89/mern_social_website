import React from 'react'
import './styles/Card.css'

function Card(props) {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  )
}

export default Card
