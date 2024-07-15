import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Upload from './Upload';
import Table from './Table';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://mern-image-upload-n1qj.onrender.com');
      setData(response.data);
    };
    fetchData();
  }, []);

  const handleDataChange = (newData) => {
    toast.success('Upload Successfully')
    setData((prevData) => [...prevData, newData]);
  };

  const handleDataUpdate = (updatedData) => {
    toast.success('Update Successfully')
    setData((prevData) => prevData.map((item) => item._id === updatedData._id ? updatedData : item))
  };

  const handleDataDelete = async (id) => {
    try {
      toast.info('deleted')
      setData((prevData) => prevData.filter((item) => item._id !== id));
      await axios.delete(`https://mern-image-upload-n1qj.onrender.com/delete/${id}`);

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="App">
      <ToastContainer position="top-center" theme="dark" />
      <h1>CRUD App with Image Upload</h1>
      <Upload onAddData={handleDataChange} />
      <hr />
      <Table data={data} onUpdate={handleDataUpdate} onDelete={handleDataDelete} />
    </div>
  );
}

export default App;
