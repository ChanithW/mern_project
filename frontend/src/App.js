import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IMStoring from "./pages/IMStoring.js"; //Amath
import IMLogin from "./pages/IMLogin.js"; //Amath
import IMDispatch from "./pages/IMDispatch.js"; //Amath
import IMDashboard from "./pages/IMDashboard.js"; //Amath
import IMStoringEdit from "./pages/IMStoringEdit.js"; //Amath
import IMDispatchEdit from "./pages/IMDispatchEdit.js"; //Amath

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


import ODMdriverlogin from "./pages/ODMdriverlogin.js";
import ODMhome from "./pages/ODMhome.js";
import ODMview from "./pages/ODMview.js";
import ODMedit from "./pages/ODMedit.js";
import ODinsert from "./pages/ODinsert.js";
import ODMDashboard from "./pages/ODMDashboard.js";
import ODMtracker from "./pages/RealTimeTracking.js";
import VehicleTracker from "./pages/VehicleTracker.js";

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
      <Route path="/IMDispatch" element={<IMDispatch/>} /*Amath*/ />
      <Route path="/IMDashboard" element={<IMDashboard/>} /*Amath*/ />
      <Route path="/IMStoringEdit/:id" element={<IMStoringEdit/>} /*Amath*/ />
      <Route path="/IMDispatchEdit/:id" element={<IMDispatchEdit/>} /*Amath*/ />
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
      <Route path="/ODMdriverlogin" element={<ODMdriverlogin />} />
      <Route path="/ODMhome" element={<ODMhome />} />
      <Route path="/ODMview" element={<ODMview />} />
      <Route path="/ODMedit/:id" element={<ODMedit />} />
      <Route path="/ODinsert" element={<ODinsert />} />
      <Route path="/ODMDashboard" element={<ODMDashboard />} />
















          <Route path="/ODMtracker" element={<VehicleTracker />} />
       
    </Routes>
  </Router>
</StrictMode>

  );
}

export default App;
