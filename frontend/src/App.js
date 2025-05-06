import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.js"; //admin
import AdminDashboard from "./pages/AdminDashboard.js"; //admin
import IMStoring from "./pages/IMStoring.js"; //Amath
import IMLogin from "./pages/IMLogin.js"; //Amath

import FDMLogin from "./pages/FDMLogin.js";
import FDMdashBoard from "./pages/FDMdashBoard.js";
import FDMscheduleRead from "./pages/FDMscheduleRead.js";
import FDMdRecordsRead from "./pages/FDMdRecordsRead.js";
import FDMfScheduleCreate from "./pages/FDMfSheduleCreate.js";
import FDMfScheduleEdit from "./pages/FDMfScheduleEdit.js";
import FDMdRecordsCreate from "./pages/FDMdRecordsCreate.js";
import FDMdRecordsEdit from "./pages/FDMdRecordsEdit.js";
import Aboutus from "./pages/Aboutus.js"
import FAQ from "./pages/FAQ.js";
import FDMfemail from "./pages/FDMfemail"
import AddUsers from "./pages/AddUsers";
import EditUser from "./pages/EditUser";
import FinanceLogin from "./pages/FMLogin.js";
import FMRead from "./pages/FMRead.js";
import FMCreate from "./pages/FMCreate.js";
import FMUpdate from "./pages/FMUpdate.js";
import FMDelete from "./pages/FMDelete.js";
//import PayrollManagement from "./components/PayrollManagement";


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
      <Route path="/fdm-login" element={<FDMLogin />} />
      <Route path="/fdm-dashboard" element={<FDMdashBoard />} />
      <Route path="/fdm-scheduleRead" element={<FDMscheduleRead />} />
      <Route path="/fdm-drecordsRead" element={<FDMdRecordsRead />} />
      <Route path="/fdm-fScheduleCreate" element={<FDMfScheduleCreate />} />
      <Route path="/fdm-fScheduleEdit/:id" element={<FDMfScheduleEdit />} />
      <Route path="/fdm-dRecordsCreate" element={<FDMdRecordsCreate />} />
      <Route path="/fdm-dRecordsEdit/:id" element={<FDMdRecordsEdit/>} />
      <Route path="/about-us" element={<Aboutus/>} />
      <Route path="/faq" element={<FAQ/>} />
      <Route path="/fdm-femail" element={<FDMfemail/>} />

      <Route path="/add-user" element={<AddUsers />} />
      <Route path="/edit-user/:id" element={<EditUser />} />

      <Route path="/finance-login" element={<FinanceLogin />} />
      <Route path="/finance-dashboard" element={<FMRead />} />
      <Route path="/add-finance" element={<FMCreate />} />
      <Route path="/edit-finance/:id" element={<FMUpdate />} />
      <Route path="/delete-finance/:id" element={<FMDelete />} />
      {/* <Route path="/payroll-management" element={<PayrollManagement />} /> */}
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
