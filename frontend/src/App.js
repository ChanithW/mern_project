import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Inventory Management Routes
import IMStoring from "./pages/IMStoring.js";
import IMLogin from "./pages/IMLogin.js";
import IMDispatch from "./pages/IMDispatch.js";
import IMDashboard from "./pages/IMDashboard.js";
import IMStoringEdit from "./pages/IMStoringEdit.js";
import IMDispatchEdit from "./pages/IMDispatchEdit.js";

// Fertilization & Disease Management Routes
import FDMLogin from "./pages/FDMLogin.js";
import FDMdashBoard from "./pages/FDMdashBoard.js";
import FDMscheduleRead from "./pages/FDMscheduleRead.js";
import FDMdRecordsRead from "./pages/FDMdRecordsRead.js";
import FDMfScheduleCreate from "./pages/FDMfSheduleCreate.js";
import FDMfScheduleEdit from "./pages/FDMfScheduleEdit.js";
import FDMdRecordsCreate from "./pages/FDMdRecordsCreate.js";
import FDMdRecordsEdit from "./pages/FDMdRecordsEdit.js";
import FDMfertilizerGenerator from "./pages/FDMfertilizerGenerator.js";
import FDMdDiseaseRemedies from "./pages/FDMdDiseaseRemedies.js";

import Aboutus from "./pages/Aboutus.js";
import FAQ from "./pages/FAQ.js";
import FDMfemail from "./pages/FDMfemail";

import AddUsers from "./pages/AddUsers";
import EditUser from "./pages/EditUser";

// Finance Management Routes
import FinanceLogin from "./pages/FMLogin.js";
import FMRead from "./pages/FMRead.js";
import FMCreate from "./pages/FMCreate.js";
import FMUpdate from "./pages/FMUpdate.js";
import FMDelete from "./pages/FMDelete.js";

// Admin Routes
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";

// Employee Management Routes
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
import EmAttendance from "./pages/EmAttendance.js";

// Order & Delivery Management Routes
import ODMdriverlogin from "./pages/ODMdriverlogin.js";
import ODMhome from "./pages/ODMhome.js";
import ODMview from "./pages/ODMview.js";
import ODMedit from "./pages/ODMedit.js";
import ODinsert from "./pages/ODinsert.js";
import ODMDashboard from "./pages/ODMDashboard.js";
import ODMtracker from "./pages/RealTimeTracking.js";
import VehicleTracker from "./pages/VehicleTracker.js";

// New Auth Pages
import DeliveryLogin from "./pages/ODMdriverlogin.js";
import EmployeeLogin from "./pages/EMlogin.js";
import FertilizationLogin from "./pages/FDMLogin.js";
import InventoryLogin from "./pages/IMLogin.js";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Authentication Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/finance-login" element={<FinanceLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/fertilization-login" element={<FertilizationLogin />} />
          <Route path="/inventory-login" element={<InventoryLogin />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />

          {/* Legacy Login Routes (to be deprecated) */}
          <Route path="/IMLogin" element={<IMLogin />} />
          <Route path="/fdm-login" element={<FDMLogin />} />
          <Route path="/EMlogin" element={<EMlogin />} />
          <Route path="/ODMdriverlogin" element={<ODMdriverlogin />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <AddUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:id"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <EditUser />
              </ProtectedRoute>
            }
          />

          {/* Finance Management Routes */}
          <Route
            path="/finance-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Finance officer", "Owner"]}>
                <FMRead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-finance"
            element={
              <ProtectedRoute allowedRoles={["Finance officer", "Owner"]}>
                <FMCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-finance/:id"
            element={
              <ProtectedRoute allowedRoles={["Finance officer", "Owner"]}>
                <FMUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-finance/:id"
            element={
              <ProtectedRoute allowedRoles={["Finance officer", "Owner"]}>
                <FMDelete />
              </ProtectedRoute>
            }
          />

          {/* Employee Management Routes */}
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EMregister"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EMregister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EMview"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EMview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EMedit/:id"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EMedit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TeaPluckingForm"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <TeaPluckingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TeaPluckingTable"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <TeaPluckingTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TeaPluckingEdit/:id"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <TeaPluckingEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/QrScanner"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <QrScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AttendanceList"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <AttendanceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EmployeePerformance"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EmployeePerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EmAttendance"
            element={
              <ProtectedRoute allowedRoles={["Estate manager"]}>
                <EmAttendance />
              </ProtectedRoute>
            }
          />

          {/* Fertilization & Disease Management Routes */}
          <Route
            path="/fertilization-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMdashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-scheduleRead"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMscheduleRead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-drecordsRead"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMdRecordsRead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-fScheduleCreate"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMfScheduleCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-fScheduleEdit/:id"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMfScheduleEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-dRecordsCreate"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMdRecordsCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-dRecordsEdit/:id"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMdRecordsEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-femail"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMfemail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-fertilizerGenerator"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMfertilizerGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fdm-dDiseaseRemedies"
            element={
              <ProtectedRoute
                allowedRoles={["Agricultural technician", "Supervisor"]}
              >
                <FDMdDiseaseRemedies />
              </ProtectedRoute>
            }
          />

          {/* Inventory Management Routes */}
          <Route
            path="/inventory-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Inventory manager"]}>
                <IMDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/IMStoring"
            element={
              <ProtectedRoute allowedRoles={["Inventory manager"]}>
                <IMStoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/IMDispatch"
            element={
              <ProtectedRoute allowedRoles={["Inventory manager"]}>
                <IMDispatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/IMStoringEdit/:id"
            element={
              <ProtectedRoute allowedRoles={["Inventory manager"]}>
                <IMStoringEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/IMDispatchEdit/:id"
            element={
              <ProtectedRoute allowedRoles={["Inventory manager"]}>
                <IMDispatchEdit />
              </ProtectedRoute>
            }
          />

          {/* Order & Delivery Management Routes */}
          <Route
            path="/delivery-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <ODMDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ODMhome"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <ODMhome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ODMview"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <ODMview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ODMedit/:id"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <ODMedit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ODinsert"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <ODinsert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ODMtracker"
            element={
              <ProtectedRoute allowedRoles={["Driver", "Inventory manager"]}>
                <VehicleTracker />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
