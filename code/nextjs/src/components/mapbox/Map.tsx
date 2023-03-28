import {Map as Mapbox, GeolocateControl, Marker, Popup, useMap} from 'react-map-gl'
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import mapboxgl from "mapbox-gl";
import Test from "@/components/mapbox/Markers/test";
import RouteLocationMarker from "@/components/mapbox/Markers/routeLocation";








const Map = () => {


  const zoomLoc = useSelector((state:RootState) => state.location.coords)
  const routeLoc = useSelector((state:RootState) => state.route)

  const mapRef = useRef(null)

  useEffect(()=>{

    let found = 11

    if(zoomLoc?.found){
      found = 16
    }

    // @ts-ignore
    mapRef?.current?.flyTo({
      center: [zoomLoc.longitude, zoomLoc.latitude],
      zoom: found,
      speed:0.7
    })
  }, [zoomLoc]) //eslint-disable-line



  return(
    <>
      <Mapbox ref={mapRef}
        initialViewState={{
          longitude: 103.808052586332,
          latitude: 1.3516161224392,
          zoom: 11
      }}

        mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      >
        <GeolocateControl showAccuracyCircle={true} showUserHeading={true} />
        <Test />
        <RouteLocationMarker />
      </Mapbox>
    </>
  )
}



export default Map