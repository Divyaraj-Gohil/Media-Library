import React, { useState, useEffect } from 'react'
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

  const handleDataDelete = async (id, img) => {
    try {
      toast.info('deleted')
      setData((prevData) => prevData.filter((item) => item._id !== id));

      // const cldel = await axios.delete(`https://cors-anywhere.herokuapp.com/https://api.cloudinary.com/v1_1/dte2qkwtg/image/${publicId}`, {
      //   headers: {
      //     Authorization: `Basic ${Buffer.from(`321518439611524:voyDKXEzyEpjUkKQWA-xtjuNnMA`).toString('base64')}`
      //   }
      // })
      // console.log(cldel)
      await axios.delete(`https://mern-image-upload-n1qj.onrender.com/delete/${id}`);

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="App">
      <ToastContainer position="top-center" theme="dark" />
      <h3>CRUD App with Image Upload + Cloudinary</h3>
      <Upload onAddData={handleDataChange} />
      <hr />
      <Table data={data} onUpdate={handleDataUpdate} onDelete={handleDataDelete} />
    </div>
  );
}

export default App;
