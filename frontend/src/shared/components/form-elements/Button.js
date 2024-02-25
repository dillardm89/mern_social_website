import React from 'react'
import { Link } from 'react-router-dom'
import './styles/Button.css'

/**
 * Component for rendering button element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.href string for html <a> tag button
 * @param {String} props.to string for navigate to='' button
 * @param {String} props.exact string for navigate exact
 * @param {String} props.type string for default button types (submit)
 * @param {String} props.size string for setting CSS class name
 * @param {String} props.inverse string for setting CSS class name
 * @param {String} props.danger string for setting CSS class name
 * @param {Boolean} props.disabled button disabled true/false
 * @param {React.ReactNode} props.children passing along props for <button> tag functionality
 * @param {() => void} props.onClick callback function for button action
 * @returns {React.JSX.Element} Button Element
 */
function Button(props) {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} ${
          props.inverse && 'button--inverse'
        } ${props.danger && 'button--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    )
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button button--${props.size || 'default'} ${
          props.inverse && 'button--inverse'
        } ${props.danger && 'button--danger'}`}
      >
        {props.children}
      </Link>
    )
  }

  return (
    <button
      className={`button button--${props.size || 'default'} ${
        props.inverse && 'button--inverse'
      } ${props.danger && 'button--danger'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default Button
