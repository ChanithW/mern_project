import "./App.css";
import { StrictMode } from "react";
import Home from "./pages/home.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </StrictMode>
  );
}

export default App;
