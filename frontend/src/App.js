import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import IMStoring from "./pages/IMStoring.js"; //Amath
import IMLogin from "./pages/IMLogin.js"; //Amath



function App() {
  return (
<StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/IMLogin" element={<IMLogin />} /*Amath*/ />
      <Route path="/IMStoring" element={<IMStoring/>}/*Amath*/ />
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
