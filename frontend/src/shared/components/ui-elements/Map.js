import React, { useRef, useEffect } from 'react'
import './styles/Map.css'

/**
 * Component for rendering error modal element
 * Props passed down from various other components
 * @param {Object} props
 * @param {String} props.style string for setting in-line CSS styling
 * @param {String} props.className string for setting CSS class name
 * @param {String} props.zoom string for map zoom setting
 * @param {Object} props.center coordinates (lat, lng) for map center location
 * @returns {Object} Google Map Element
 */
function Map(props) {
  const mapRef = useRef()
  const { center, zoom } = props

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    })

    new window.google.maps.Marker({ position: center, map: map })
  }, [center, zoom])

  return (
    <div
      ref={mapRef}
      id='map'
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  )
}

export default Map
