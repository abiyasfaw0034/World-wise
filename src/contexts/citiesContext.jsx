import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const Citycontext = createContext();

const base_url = "http://localhost:8000";

const initialState = {
  cities: [],
  isloading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isloading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isloading: false,
        cities: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isloading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isloading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        isloading: false,
        currentCity: action.payload,
      };
    case "rejected":
      return { ...state, isloading: false, error: action.payload };
    default:
      throw new Error("unknown action type");
  }
}
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isloading, setIsLoading] = useState(false);
  // const [currentCity, setcurrentCity] = useState({});
  const [{ cities, isloading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${base_url}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities:",
        });
        // alert("There was an error loading the cities...");
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${base_url}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error getting the cities:",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${base_url}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);

      dispatch({ type: "cities/created", payload: data });
      // console.log(data);
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the cities:",
      });
      console.error("There was an error creating the city:", error);
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${base_url}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the cities:",
      });
      console.error("There was an error deleting the city:", error);
    }
  }

  return (
    <Citycontext.Provider
      value={{
        cities,
        isloading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </Citycontext.Provider>
  );
}
function useCities() {
  const context = useContext(Citycontext);
  if (context === undefined) {
    throw new Error("postcontext was used outside postprovider");
  }
  return context;
}
export { CitiesProvider, useCities };
