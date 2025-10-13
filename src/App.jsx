import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Home from "./Pages/Home";
import ParkingSpaces from "./Pages/ParkingSpaces";
import Bookings from "./pages/Bookings";
import Login from "./Pages/Login";
import Register from "./pages/Register";


const App = () => {
  return (
    <Router>
      {/* Layout for public pages with Navbar/Footer */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<ParkingSpaces />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>
      </Routes>

      {/* Layout for authentication pages */}
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
