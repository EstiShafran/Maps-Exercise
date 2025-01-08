import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RoomIcon from '@mui/icons-material/Room';
// import MapComp from './MapComp';
import { MapContainer, TileLayer, Popup, useMap, useMapEvents, CircleMarker } from 'react-leaflet';
import { Marker } from 'react-leaflet/Marker'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css'

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
})

const MapUpdater = ({ selectedLocation }) => {
    const map = useMap(); // שימוש ב- useMap בתוך קומפוננטה שהיא בתנאי ההיררכיה של MapContainer
    useEffect(() => {
        if (selectedLocation.lat == 31.7788242 && selectedLocation.lon == 35.2257626 && selectedLocation.display_name == "ירושלים") {
            map.locate()
            // console.log(map);
        }
        if (map) {
            map.setView([selectedLocation.lat, selectedLocation.lon], map.getZoom()); // עדכון המפה
        }
    }, [selectedLocation, map]); // עדכון כש- selectedLocation משתנה
    return null; // לא מציגה שום תוכן, רק מעדכנת את המפה
};


const MapComponent = () => {
    let [results, setResults] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [selectedLocation, setSelectedLocation] = useState({
        display_name: "ירושלים",
        lat: 31.7788242,
        lon: 35.2257626
    })
    const position = [selectedLocation.lat, selectedLocation.lon]

    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (myLocation)=>{
                const { latitude, longitude } = myLocation.coords;
               setSelectedLocation({
                display_name:"אתה כאן",
                lat:latitude,
                lon:longitude
               })
            },
            (error) => {
                console.error('Error getting location:', error);
              }
        )
        }
        
    },[])

    const search = async () => {
        let value = inputValue
        if (!value) {
            setResults([]);
            return
        }
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
            response = await response.json()
            setResults([]);
            setResults(response.map(obj => ({
                display_name: obj.display_name,
                lat: obj.lat,  // קבלת קואורדינטות ה- Latitude
                lon: obj.lon   // קבלת קואורדינטות ה- Longitude
            })))
        } catch (err) {
            console.error(err)
        }
        // console.log(results);
    }

    useEffect(() => {
        search()
    }, [inputValue])

    const handleLocationSelect = () => {
        console.log("המקום מתעדכן");
        // עדכון המיקום שנבחר
        const selectedValue = inputValue;
        console.log("selectedValue", selectedValue);
        console.log("selectedLocation", selectedLocation);
        const location = results.find(result => result.display_name === selectedValue);
        if (location) {
            console.log("location:", location)
            setSelectedLocation({
                display_name: location.display_name,
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon)
            });
        }
    }
    return (
        <div id='MapComponentBody'>
            <div id='form-div'>
                <form>
                    <input type='text' placeholder='שם משתמש'></input><br />
                    <input
                        type='search'
                        value={inputValue}
                        list="optionList"
                        id='place'
                        placeholder='כתובת לחיפוש'
                        onChange={(e) => { setInputValue(e.target.value) }}
                        onBlur={handleLocationSelect}
                    >
                    </input><br />
                    <datalist id="optionList">
                        {results.map((option, index) => (
                            <option
                                key={index}
                                value={option.display_name}
                            />
                        ))}
                    </datalist>
                    <input type='number' placeholder='מרחק מהכתובת (בק"מ)'></input><br />
                    <input type='text' placeholder='טלפון'></input><br />
                    <input type='email' placeholder='מייל'></input><br />
                    <input type='number' placeholder='מספר חדרים'></input><br />
                    <div>
                        <FormControlLabel control={<Checkbox />} label="חיבור לאינטרנט" /><br />
                        <FormControlLabel control={<Checkbox />} label="מטבח" /><br />
                        <FormControlLabel control={<Checkbox />} label="מכונת קפה" /><br />
                    </div>
                    <input type='button' value="חיפוש" id='submit' />
                </form>
            </div>
            <div id="map" style={{ height: "100vh", width: "98%" }}>
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={defaultIcon}>
                        <Popup>{selectedLocation.display_name}</Popup>
                    </Marker>
                    {/* <LocationMarker></LocationMarker> */}
                    <MapUpdater selectedLocation={selectedLocation}></MapUpdater>
                </MapContainer>
            </div>
        </div>
    );
}

export default MapComponent;


