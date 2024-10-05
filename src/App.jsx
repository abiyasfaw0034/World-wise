import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/citiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CountryList from "./components/CountryList";
import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";
import { Suspense, lazy } from "react";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import Pagenotfound from "./pages/PageNotFound";
// import Applayout from "./pages/AppLayout";
// import Login from "./pages/Login";

// dist/assets/index-Cyx0EFj9.css   30.05 kB │ gzip:   5.08 kB
// dist/assets/index-N3EShSj1.js   508.45 kB │ gzip: 148.11 kB

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Pagenotfound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const Applayout = lazy(() => import("./pages/AppLayout"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="Product" element={<Product />} />

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <Applayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              <Route path="Pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<Pagenotfound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
