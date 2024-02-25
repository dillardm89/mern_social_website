import React from 'react'
import './styles/LoadingSpinner.css'

/**
 * Component for rendering loading spinner element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.asOverlay string for setting CSS class name
 * @returns {React.JSX.Element} LoadingSpinner Element
 */
function LoadingSpinner(props) {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className='lds-dual-ring'></div>
    </div>
  )
}

export default LoadingSpinner
