import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
export default function MapviewComponent() {
  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 41.3851,
    lng: 2.1734,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCI8GElS9zajCMXGKN1opMQgI4L9tkiY7c">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      />
    </LoadScript>
  );
}
<a href="/login" className="btn" title="Register / Log In">
  Register/Log In
</a>;
