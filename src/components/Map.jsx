import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/citiesContext";
import { useGeolocation } from "../Hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../Hooks/useUrlPosition";

function Map() {
  const [mapPostion, setmapPosition] = useState([40, 0]);
  const { cities } = useCities();

  const [mapLat, mapLng] = useUrlPosition();

  const {
    position: geolocationposition,
    isLoading: isLoadingpostion,
    getPosition,
  } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setmapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  useEffect(
    function () {
      if (geolocationposition)
        setmapPosition([geolocationposition.lat, geolocationposition.lng]);
    },
    [geolocationposition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationposition && (
        <Button type={"position"} onClick={getPosition}>
          {isLoadingpostion ? "Loading..." : "use your location"}
        </Button>
      )}
      <MapContainer
        center={mapPostion}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        ;
        <ChangeCenter position={mapPostion} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
