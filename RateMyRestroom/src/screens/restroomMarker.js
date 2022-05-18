import React, { useState, useEffect } from 'react'
import { Marker } from 'react-native-maps'

const RestroomMarker = props => {
  const { longitude, latitude} = props

  const [coordinates] = useState({
    longitude: Number(longitude),
    latitude: Number(latitude)
  })

  return (
    <Marker
      coordinate={coordinates}>
    </Marker>
  )
}

export default RestroomMarker