import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'

const Upload = ({ onAddData }) => {
    const [name, setname] = useState('');
    const [detail, setdetail] = useState('');
    const [image, setImage] = useState(null);
    const [isload, setisload] = useState(false)
    const [previewImage, setPreviewImage] = useState(null); // State for previewing selected image

    const handleSubmit = async (e) => {
        e.preventDefault();
        setisload(true)
        if (!name.trim()) {
            alert('Please enter a name.');
            return; // Prevent submission if name is empty
        }

        const formData = new FormData();
        formData.append('file', image)
        formData.append('upload_preset', 'imagecloud');
        formData.append('cloud_name', 'dte2qkwtg');

        try {//https://mern-image-upload-n1qj.onrender.com

            const cloudres = await axios.post('https://api.cloudinary.com/v1_1/dte2qkwtg/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const clouddata = await cloudres.data.url
            const ob = {
                name: name,
                detail: detail,
                image: clouddata
            }
            const response = await axios.post('https://media-library-flame.vercel.app/upload', ob);
            onAddData(response.data); // Call parent function to update data locally
            setisload(false)
            setname('');
            setdetail('');
            setImage(null);
            setPreviewImage(null);
            e.target.reset()
        }
        // Clear form after successful submission
        catch (err) {
            console.error(err);
            // Handle errors appropriately, e.g., display an error message to the user
        }
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (!selectedImage) {
            return; // Do nothing if no image is selected
        }

        if (!selectedImage.type.match('image/.*')) {
            alert('Please select an image file.')
            return// Prevent non-image files
        }

        setImage(selectedImage);
        setPreviewImage(URL.createObjectURL(selectedImage)); // Update preview image URL
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='p-4'>
                <div className=''></div>
                <div className="">
                    <label htmlFor="name">Name:</label>
                    <input className='mb-3 mx-3'
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        required
                    />
                </div>
                <div className=" mb-3">
                    <label htmlFor="detail">Detail:</label>
                    <textarea
                        className='mx-3'
                        id="detail"
                        value={detail}
                        onChange={(e) => setdetail(e.target.value)}
                        rows="5"
                    />
                </div>
                <div className="p">
                    <label htmlFor="image">Image:</label>
                    <input type="file" className="mx-3 mb-3" id="image" onChange={handleImageChange} />
                    {previewImage && (
                        <img src={previewImage} alt="Preview" width="100" />
                    )}
                </div>
                <button type="submit" className='btn btn-primary'>
                    {isload ? 'Please wait...' : 'Submit'}
                </button>
            </form>
        </>
    );
};

export default Upload;
