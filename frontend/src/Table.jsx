import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css'

const Table = ({ data, onUpdate, onDelete }) => {
    const [edit, setedit] = useState(-1)
    const [name, setname] = useState();
    const [detail, setdetail] = useState();
    const [image, setImage] = useState();

    const handledit = async (e) => {
        const ob = {}
        try {//https://mern-image-upload-n1qj.onrender.com
            if (image) {
                const formData = new FormData();
                formData.append('file', image)
                formData.append('upload_preset', 'imagecloud');
                formData.append('cloud_name', 'dte2qkwtg');
                const cloudres = await axios.post('https://api.cloudinary.com/v1_1/dte2qkwtg/image/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const clouddata = await cloudres.data.url
                ob.image = clouddata
            }
            if (name) ob.name = name
            if (detail) ob.detail = detail
            if (ob === null) console.log("null", ob)
            const res = await axios.put(`http://localhost:4000/update/${edit}`, ob);

            onUpdate(res.data)
            setedit(-1)
        } catch (err) {
            toast.error('fill atleast one field for update')
            if (err.response.data.message) setedit(-1)
        }
    };
    const handlecancel = () => {
        setedit(-1)
    }

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
                            <td><input type="text" defaultValue={item.name} onChange={e => setname(e.target.value)} /></td>
                            <td><input type="text" defaultValue={item.detail} onChange={e => setdetail(e.target.value)} /></td>
                            <td><input type="file" onChange={e => setImage(e.target.files[0])} /></td>
                            <button className='btn btn-warning' onClick={handledit}>Update</button>
                            <button className='btn btn-warning' onClick={handlecancel}>Cancel</button>
                        </tr>

                        ) :
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.detail}</td>
                            <td>
                                <img src={item.image} width="100" />
                            </td>
                            <td>
                                <button className='btn btn-warning' onClick={() => setedit(item._id)}>edit</button>
                                <button className='btn btn-danger' onClick={() => onDelete(item._id, item.image)}>Delete</button>
                            </td>
                        </tr>
                }
                )}
            </tbody>
        </table>
    );
};


export default Table