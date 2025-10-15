import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import UsersLayout from "./layouts/UsersLayout";

// Pages
import Home from "./Pages/Home";
import ParkingSpaceDetails from "./Pages/ParkingSpaceDetails";
import Bookings from "./pages/Bookings";
import Login from "./Pages/Login";
import Register from "./pages/Register";
import DriverDashboard from "./Pages/DriverDashboard";
import ScanQRCode from "./Pages/ScanQRCode";
import MyBookings from "./Pages/MyBookings";
import DriverWallet from "./Pages/DriverWallet";
import OperatorDashboard from "./Pages/OperatorDashboard";
import AddParkingSpace from "./Pages/AddParkingSpace";
import MySpaces from "./Pages/MySpaces";
import InviteManager from "./Pages/InviteManager";
import AdminDashboard from "./Pages/AdminDashboard";
// Add other page imports as needed
import ActiveSession from "./Pages/ActiveSession";
import ManageSpace from "./Pages/ManageSpaces";
import Test from "./Pages/Test";
import RoleSelection from "./Pages/RoleSelections";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import ProfileSettings from "./Pages/ProfileSettings";
// Add other page imports as needed

const App = () => {
  return (
    <Router>
      {/* Public routes with MainLayout */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/test" element={<Test />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/sign-in" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
        </Route>
      </Routes>

      {/* Authentication routes */}
      <Routes>
        <Route element={<AuthLayout />}>
  
       
    
        </Route>
      </Routes>

      {/* Protected dashboard routes with sidebar */}
      <Routes>
        <Route element={<UsersLayout />}>
          <Route path="/dashboard" element={<DriverDashboard />} />
          <Route path="/dashboard/driver" element={<DriverDashboard />} />
          <Route path="/dashboard/scan-qr" element={<ScanQRCode />} />
          <Route path="/dashboard/bookings" element={<MyBookings />} />
          <Route path="/dashboard/wallet" element={<DriverWallet />} />
          <Route path="/dashboard/operator" element={<OperatorDashboard />} />
          <Route path="/dashboard/add-parkingspace" element={<AddParkingSpace />} />
          <Route path="/dashboard/my-spaces" element={<MySpaces />} />
          <Route path="/dashboard/invite" element={<InviteManager />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/active-session" element={<ActiveSession />} />
          <Route path="/dashboard/space-details" element={<ParkingSpaceDetails />} />
          <Route path="/dashboard/manage-space" element={<ManageSpace />} />
          <Route path="/dashboard/profile" element={<ProfileSettings />} />

          
          {/* Add more routes for other dashboard pages */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;