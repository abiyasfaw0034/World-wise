// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../Hooks/useUrlPosition";
import "react-datepicker/dist/react-datepicker.css";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/citiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const baseurl = "https://api.bigdatacloud.net/data/reverse-geocode-client?";
// latitude=0&longitude=0
function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setemoji] = useState("");
  const [geocodingerror, setgeocodingerror] = useState("");
  const [isloadinggeolocation, setisloadinggeolocation] = useState(false);
  const [lat, lng] = useUrlPosition();

  const navigate = useNavigate();
  const { createCity, isloading } = useCities();
  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setisloadinggeolocation(true);
          setgeocodingerror("");
          const res = await fetch(`${baseurl}latitude=${lat}&longitude=${lng}`);
          const data = await res.json();
          if (!data.countryCode)
            throw new Error("that doesnt seem to be a city😁");

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setemoji(convertToEmoji(data.countryCode));
          console.log(data);
        } catch (error) {
          setgeocodingerror(error.message);
        } finally {
          setisloadinggeolocation(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );
  async function handleSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: lat, lng: lng },
    };
    await createCity(newCity);
    navigate("/app");
    // console.log(newCity);
  }
  if (isloadinggeolocation) return <Spinner />;
  if (!lat & !lng)
    return <Message message={"start by clicking somewhere on the map"} />;
  if (geocodingerror) return <Message message={geocodingerror} />;
  return (
    <form
      className={`${styles.form} ${isloading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/mm/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
