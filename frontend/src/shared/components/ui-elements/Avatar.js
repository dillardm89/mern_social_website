import React from 'react'
import './styles/Avatar.css'

/**
 * Component for rendering user avatar element
 * Props passed down from UserItem.js
 * @param {Object} props
 * @param {String} props.className string for setting CSS class name
 * @param {String} props.style string for setting in-line CSS styling
 * @param {String} props.image string uri of the avatar image
 * @param {String} props.alt string for image alt text
 * @param {String} props.width string for setting in-line style image width
 * @param {String} props.height string for setting in-line style image height
 * @returns {React.JSX.Element} Avatar Element
 */
function Avatar(props) {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  )
}

export default Avatar
