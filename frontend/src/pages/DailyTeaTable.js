import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyTeaTable = () => {
  const [dailyTeaRecords, setDailyTeaRecords] = useState([]);

  useEffect(() => {
    const fetchDailyTeaRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5000/dailyTea");
        setDailyTeaRecords(response.data.dailyTeaRecords);
      } catch (error) {
        console.error("Error fetching daily tea records:", error);
      }
    };

    fetchDailyTeaRecords();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Date</th>
          <th>Daily Kg of Tea</th>
          <th>Daily Wages</th>
        </tr>
      </thead>
      <tbody>
        {dailyTeaRecords.map((record) => (
          <tr key={record._id}>
            <td>{record.employeeId.name}</td>
            <td>{new Date(record.date).toLocaleDateString()}</td>
            <td>{record.dailyKg}</td>
            <td>{record.dailyWages}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DailyTeaTable;