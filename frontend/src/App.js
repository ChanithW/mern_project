import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import EMlogin from "./pages/EMlogin.js";
import EMregister from "./pages/EMregister.js";
import EMview from "./pages/EMview.js";
import EMedit from "./pages/EMedit.js";
import TeaPluckingForm from "./pages/TeaPluckingForm.js";
import TeaPluckingTable from "./pages/TeaPluckingTable.js";
import TeaPluckingEdit from "./pages/TeaPluckingEdit.js";
import QrScanner from "./pages/QrCodeScanner.js";
import AttendanceList from "./pages/AttendanceList.js";
import EmployeePerformance from "./pages/EmployeePerformance.js";
import EmployeeDashboard from "./pages/EmployeeDashboard.js";



function App() {
  return (
<StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/EMlogin" element={<EMlogin />} />
     < Route path="/EMregister" element={<EMregister />} />
     < Route path="/EMview" element={<EMview />} />
     < Route path="/EMedit/:id" element={<EMedit/>}/>
     < Route path="/TeaPluckingForm" element={<TeaPluckingForm/>}/>
     < Route path="/TeaPluckingTable" element={<TeaPluckingTable/>}/>
     < Route path="/TeaPluckingEdit/:id" element={<TeaPluckingEdit/>}/>
     < Route path="/QrScanner" element={<QrScanner/>}/>
     < Route path="/AttendanceList" element={<AttendanceList/>}/>
     <Route path="/EmployeePerformance" element={<EmployeePerformance/>}/>
    <Route path="/EmployeeDashboard" element={<EmployeeDashboard/>}/>
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
