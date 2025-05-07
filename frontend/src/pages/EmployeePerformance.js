import React, { useEffect, useState } from "react";
import goldImg from '../assets/images/gold.png';
import silverImg from '../assets/images/medal.png';
import bronzeImg from '../assets/images/bronze.png';
import Header from '../components/header';

const EmployeePerformance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:5000/tea-plucking");
        const data = await response.json();
        
        // Aggregate plucking data by employee
        const employeeMap = {};
        data.records.forEach(record => {
          const month = new Date(record.date).getMonth();
          const year = new Date(record.date).getFullYear();
          const key = `${record.employeeId}-${month}-${year}`;
          
          if (!employeeMap[key]) {
            employeeMap[key] = {
              _id: record.employeeId,
              employeeName: record.employeeName,
              totalKgPlucked: 0
            };
          }
          employeeMap[key].totalKgPlucked += record.kgPlucked;
        });
        
        setEmployees(Object.values(employeeMap));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Categorize employees based on total tea plucked in the month
  const highPerformers = employees.filter(emp => emp.totalKgPlucked > 3000);
  const moderatePerformers = employees.filter(emp => emp.totalKgPlucked >= 1500 && emp.totalKgPlucked < 3000);
  const lowPerformers = employees.filter(emp => emp.totalKgPlucked < 1500);

  // Download function for employee categories
  const downloadEmployeeCategories = () => {
    // Prepare CSV content
    let csvContent = "Category,Employee Name,Total KG Plucked\n";

    // Add high performers
    highPerformers.forEach(emp => {
      csvContent += `High Performer,${emp.employeeName},${emp.totalKgPlucked}\n`;
    });

    // Add moderate performers
    moderatePerformers.forEach(emp => {
      csvContent += `Moderate Performer,${emp.employeeName},${emp.totalKgPlucked}\n`;
    });

    // Add low performers
    lowPerformers.forEach(emp => {
      csvContent += `Low Performer,${emp.employeeName},${emp.totalKgPlucked}\n`;
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "employee_performance_categories.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col" >
    <Header />
    <div className="container mx-auto p-5 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Monthly Employee Performance </h1>
        <button 
          onClick={downloadEmployeeCategories}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Categories
        </button>
      </div>
      
      {/* Flex container for centering cards */}
      <div className="flex justify-center items-center mt-20"> {/* Increased margin-top to mt-20 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 bg-green-100 rounded-lg h-[400px] shadow-lg">
            <div className="flex items-center mb-3">
              <img 
                src={goldImg} 
                alt="notification" 
                className="w-20 h-20 object-cover mr-4" 
              />
              <h2 className="text-2xl font-semibold">High Performers (More than 3000)</h2>
            </div>
            {highPerformers.length > 0 ? (
              highPerformers.map(emp => <p key={emp._id}>{emp.employeeName} - {emp.totalKgPlucked} kg</p>)
            ) : (
              <p>No high performers</p>
            )}
          </div>

          <div className="p-4 bg-green-100 rounded-lg h-[400px] shadow-lg">
            <div className="flex items-center mb-3">
              <img 
                src={silverImg} 
                alt="notification" 
                className="w-20 h-20 object-cover mr-4" 
              />
              <h2 className="text-2xl font-semibold ">Moderate Performers (1500kg - 3000kg)</h2>
            </div>
            {moderatePerformers.length > 0 ? (
              moderatePerformers.map(emp => <p key={emp._id}>{emp.employeeName} - {emp.totalKgPlucked} kg</p>)
            ) : (
              <p>No moderate performers</p>
            )}
          </div>

          <div className="p-4 bg-green-100 rounded-lg shadow-lg">
            <div className="flex items-center mb-3">
              <img 
                src={bronzeImg} 
                alt="notification" 
                className="w-20 h-20 object-cover mr-4" 
              />
              <h2 className="text-2xl font-semibold">Low Performers (0kg - 1500kg)</h2>
            </div>
            {lowPerformers.length > 0 ? (
              lowPerformers.map(emp => <p key={emp._id}>{emp.employeeName} - {emp.totalKgPlucked} kg</p>)
            ) : (
              <p>No low performers</p>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default EmployeePerformance;
