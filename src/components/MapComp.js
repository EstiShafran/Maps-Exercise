import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComp = ({ selectedLocation }) => {
    console.log(selectedLocation);
    
    return (
        <div id="map" style={{ height: "100vh", width: "98%" }}>
            <MapContainer center={[selectedLocation.lat, selectedLocation.lon]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                    <Popup>
                        {selectedLocation.display_name}
                    </Popup>
                </Marker>
            </MapContainer>
            <h1>{selectedLocation.lat}</h1>
        </div>

    );
}

export default MapComp;

// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const MapComp = () => {
//   // מיקום ברירת מחדל למרכז המפה
//   const position = [32.0853, 34.7818]; // תל אביב

//   return (
//     <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
//       {/* זהו השכבת Tile (המפה עצמה) מתוך OpenStreetMap */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {/* סימן על המפה */}
//       <Marker position={position}>
//         <Popup>
//           זהו תל אביב!
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default MapComp;
