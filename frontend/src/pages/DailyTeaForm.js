import React, { useState } from "react";
import axios from "axios";

const DailyTeaForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [dailyKg, setDailyKg] = useState("");
  const [dailyWages, setDailyWages] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dailyTeaData = { employeeId, dailyKg, dailyWages };

    try {
      const response = await axios.post("http://localhost:8000/dailyTea", dailyTeaData);
      console.log("Daily tea record added:", response.data);
      alert("Daily tea record saved successfully!");
      setEmployeeId("");
      setDailyKg("");
      setDailyWages("");
    } catch (error) {
      console.error("Error saving daily tea record:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Employee ID:</label>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Daily Kg of Tea:</label>
        <input
          type="number"
          value={dailyKg}
          onChange={(e) => setDailyKg(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Daily Wages:</label>
        <input
          type="number"
          value={dailyWages}
          onChange={(e) => setDailyWages(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DailyTeaForm;