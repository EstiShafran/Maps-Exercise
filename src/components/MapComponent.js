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

// הגדרת סמן ברירת מחדל
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
})

// קומפוננטה שאחראית לעדכן את המפה כאשר המיקום משתנה
const MapUpdater = ({ selectedLocation }) => {
    const map = useMap();
    useEffect(() => {
        if (map) {
            // map.setView([selectedLocation.lat, selectedLocation.lon], map.getZoom()); 
            map.flyTo([selectedLocation.lat, selectedLocation.lon])
        }
    }, [selectedLocation, map]); // עדכון כש- selectedLocation משתנה
    return null; // לא מציגה שום תוכן, רק מעדכנת את המפה
};

// קומפוננטה הראשית שמציגה את המפה ואת טופס החיפוש
const MapComponent = () => {
    let [results, setResults] = useState([]) // משתנה בסטייט לאחסון התוצאות של חיפוש המיקומים
    const [inputValue, setInputValue] = useState('') // משנה בסטייט לשמירת ערך שדה החיפוש
    const [selectedLocation, setSelectedLocation] = useState({ // מצב לאחסון המיקום שנבחר (הברירת מחדל: ירושלים)
        display_name: "ירושלים",
        lat: 31.7788242,
        lon: 35.2257626
    })
    const position = [selectedLocation.lat, selectedLocation.lon] // נקודות המיקום על המפה מתעדכן בכל שלב לפי המיקום שנבחר

    // פונקציה כדי לאתר את מיקום המשתמש
    useEffect(() => {
        if (navigator.geolocation) { // בודק אם הגישה למיקום זמינה
            navigator.geolocation.getCurrentPosition(  // מקבל את המיקום הנוכחי
                (myLocation) => {
                    const { latitude, longitude } = myLocation.coords;
                    setSelectedLocation({ // עדכון המיקום שנבחר למיקום של המשתמש
                        display_name: "אתה כאן",
                        lat: latitude,
                        lon: longitude
                    })
                },
                (error) => {
                    console.error('Error getting location:', error); // טיפול בשגיאות במידה ולא ניתן לאתר את המיקום
                }
            )
        }

    }, [])// מתבצע פעם אחת כאשר הקומפוננטה נטענת

    // פונקציה לחיפוש מיקומים ב-OpenStreetMap
    const search = async () => {
        let value = inputValue // לוקחים את ערך הקלט
        if (!value) {
            setResults([]);  // אם אין ערך בקלט, מנקים את התוצאות
            return
        }
        try {
            // שולחים בקשה ל-API של OpenStreetMap
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
            response = await response.json()
            setResults([]); // מנקים את התוצאות הישנות
            setResults(response.map(obj => ({ // מעדכנים את התוצאות בנתונים החדשים
                display_name: obj.display_name,
                lat: obj.lat,
                lon: obj.lon
            })))
        } catch (err) {
            console.error(err) //טיפול בשגיאות
        }

    }

    useEffect(() => {
        search()  // מחפשים מיקומים כל פעם שערך הקלט בשדה החיפוש משתנה
    }, [inputValue])

    // פונקציה לטיפול בבחירת מיקום מתוך תוצאות החיפוש
    const handleLocationSelect = () => {
        console.log("המקום מתעדכן");
        const selectedValue = inputValue; // לוקחים את המיקום שנבחר מהקלט
        console.log("selectedValue", selectedValue);
        console.log("selectedLocation", selectedLocation);
        const location = results.find(result => result.display_name === selectedValue); // מחפשים את המיקום מתוך התוצאות
        if (location) {
            console.log("location:", location)
            setSelectedLocation({ // במידה ונמצא מעדכנים את המיקום שנבחר
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
                        onChange={(e) => { setInputValue(e.target.value) }} // בכל שינוי מעדכנים את משתנה ערך הקלט
                        onBlur={handleLocationSelect} // בעת יציאה מהשדה חיפוש, בודקים איזה מיקום נבחר
                    >
                    </input><br />
                    <datalist id="optionList">
                        {results.map((option, index) => (  // מציגים את תוצאות החיפוש בתוך רשימת אפשרויות
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
                        <Popup>{selectedLocation.display_name}</Popup>  {/* מציג את שם המקום  */}
                    </Marker>
                    <MapUpdater selectedLocation={selectedLocation}></MapUpdater> {/* עדכון המפה */}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapComponent;


