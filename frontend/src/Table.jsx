import React, { useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'

const Table = ({ data, onUpdate, onDelete }) => {
    const [edit, setedit] = useState(-1)
    const [name, setname] = useState('');
    const [detail, setdetail] = useState('');
    const [image, setImage] = useState(null);

    const handledit = async (e) => {

        const formData = new FormData();
        formData.append('name', name);
        formData.append('detail', detail);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`https://mern-image-upload-n1qj.onrender.com/update/${edit}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUpdate(response.data)
            // Call parent function to update data locally
            // setname('');
            // setdetail('');
            // setImage(null);
            setedit(-1)
            // Clear form after successful submission
        } catch (err) {
            console.error(err);
            // Handle errors appropriately, e.g., display an error message to the user
        }
    };

    return (
        <table className='table table-hover'>
            <thead className='thead-dark'>
                <tr>
                    <th>Name</th>
                    <th>Detail</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => {
                    return item._id === edit ?
                        (<tr key={item._id}>
                            <td><input type="text" onChange={e => setname(e.target.value)} /></td>
                            <td><input type="text" onChange={e => setdetail(e.target.value)} /></td>
                            <td><input type="file" onChange={e => setImage(e.target.files[0])} /></td>
                            <button className='btn btn-warning' onClick={handledit}>Update</button>
                        </tr>

                        ) :
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.detail}</td>
                            <td>
                                <img src={`https://mern-image-upload-n1qj.onrender.com/images/` + item.image} width="100" />
                            </td>
                            <td>
                                <button className='btn btn-warning' onClick={() => setedit(item._id)}>edit</button>
                                <button className='btn btn-danger' onClick={() => onDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                }
                )}
            </tbody>
        </table>
    );
};


export default Table