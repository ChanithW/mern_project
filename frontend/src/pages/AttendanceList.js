import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Button, Spinner, Dropdown } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

function AttendanceList() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    fetchAttendanceData();
  }, [filter]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/attendance';
      
      // Add query parameters for filtering by date
      if (filter !== 'all') {
        url += `?period=${filter}`;
      }
      
      const response = await axios.get(url);
      setAttendanceData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to load attendance data');
      setLoading(false);
    }
  };

  const handleScanNew = () => {
    navigate('/attendance-scanner');
  };

  const handleExport = () => {
    // Function to export attendance data as CSV
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Employee ID,Name,Phone Number,Check In Time,Status\n' + 
      attendanceData.map(row => 
        `${row.employeeId},${row.name},${row.phoneNumber},${row.checkInTime},${row.status}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = employeeFilter 
    ? attendanceData.filter(record => 
        record.name.toLowerCase().includes(employeeFilter.toLowerCase()) || 
        record.employeeId.includes(employeeFilter)
      )
    : attendanceData;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10">
      <Card className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
          <div className="flex space-x-4">
            <Button onClick={handleScanNew} gradientDuoTone="purpleToBlue">
              Scan New Attendance
            </Button>
            <Button onClick={handleExport} gradientDuoTone="greenToBlue">
              Export to CSV
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Dropdown label={`Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}>
              <Dropdown.Item onClick={() => setFilter('all')}>All Time</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('today')}>Today</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('week')}>This Week</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('month')}>This Month</Dropdown.Item>
            </Dropdown>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5"
              placeholder="Search by name or ID"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-10">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Employee ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Check In Time</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredData.length > 0 ? (
                  filteredData.map((record, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {record.employeeId}
                      </Table.Cell>
                      <Table.Cell>{record.name}</Table.Cell>
                      <Table.Cell>{record.phoneNumber}</Table.Cell>
                      <Table.Cell>
                        {new Date(record.checkInTime).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No attendance records found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AttendanceList;