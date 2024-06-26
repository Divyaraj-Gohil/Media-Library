import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Upload from './Upload';
import Table from './Table';

const BASE_URL = 'http://localhost:3000/'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(BASE_URL);
      setData(response.data);
    };
    fetchData();
  }, []);

  const handleDataChange = (newData) => {
    setData((prevData) => [...prevData, newData]);
  };

  const handleDataUpdate = (updatedData) => {
    setData((prevData) => prevData.map((item) => item._id === updatedData._id ? updatedData : item))
  };

  const handleDataDelete = async (id) => {
    try {
      setData((prevData) => prevData.filter((item) => item._id !== id));
      await axios.delete(`http://localhost:3000/delete/${id}`);

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="App">
      <h1>CRUD App with Image Upload</h1>
      <Upload onAddData={handleDataChange} />
      <hr />
      <Table data={data} onUpdate={handleDataUpdate} onDelete={handleDataDelete} />
    </div>
  );
}

export default App;
