// import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/citiesContext";

function CountryList() {
  const { cities, isloading } = useCities();
  if (isloading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message={"Add your city by clicking on a city in the map"} />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country} />
      ))}
    </ul>
  );
}
export default CountryList;
