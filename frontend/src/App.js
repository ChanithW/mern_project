import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import ODMdriverlogin from "./pages/ODMdriverlogin.js";
import ODMhome from "./pages/ODMhome.js";
import ODMview from "./pages/ODMview.js";
import ODMedit from "./pages/ODMedit.js";
import ODinsert from "./pages/ODinsert.js";
import ODMDashboard from "./pages/ODMDashboard.js";
import ODMtracker from "./pages/RealTimeTracking.js";

function App() {
  return (
<StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/ODMdriverlogin" element={<ODMdriverlogin />} />
      <Route path="/ODMhome" element={<ODMhome />} />
      <Route path="/ODMview" element={<ODMview />} />
      <Route path="/ODMedit/:id" element={<ODMedit />} />
      <Route path="/ODinsert" element={<ODinsert />} />
      <Route path="/ODMDashboard" element={<ODMDashboard />} />
      <Route path="/ODMtracker" element={<ODMtracker />} />
       
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
