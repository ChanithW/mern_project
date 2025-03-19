import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AddUsers from "./pages/AddUsers";
import EditUser from "./pages/EditUser";
import FinanceLogin from "./pages/FMLogin.js";
import FMRead from "./pages/FMRead.js";
import FMCreate from "./pages/FMCreate.js";


function App() {
  return (
<StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-user" element={<AddUsers />} />
      <Route path="/edit-user/:id" element={<EditUser />} />

      <Route path="/finance-login" element={<FinanceLogin />} />
      <Route path="/finance-dashboard" element={<FMRead />} />
      <Route path="/add-finance" element={<FMCreate />} />
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
