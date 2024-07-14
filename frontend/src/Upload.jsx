import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'

const Upload = ({ onAddData }) => {
    const [name, setname] = useState('');
    const [detail, setdetail] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for previewing selected image

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Please enter a name.');
            return; // Prevent submission if name is empty
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('detail', detail);
        if (image) {
            formData.append('image', image);
        }
        try {//https://mern-image-upload-n1qj.onrender.com
            const response = await axios.post('https://mern-image-upload-n1qj.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onAddData(response.data); // Call parent function to update data locally
            setname('');
            setdetail('');
            setImage(null);
            setPreviewImage(null);
            e.target.reset()
            // Clear form after successful submission
        } catch (err) {
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
            alert('Please select an image file.');
            return; // Prevent non-image files
        }

        setImage(selectedImage);
        setPreviewImage(URL.createObjectURL(selectedImage)); // Update preview image URL
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='p-4'>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input className='mb-3'
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="detail">Detail:</label>
                    <textarea
                        id="detail"
                        value={detail}
                        onChange={(e) => setdetail(e.target.value)}
                        rows="5"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input type="file" className="mb-3" id="image" onChange={handleImageChange} />
                    {previewImage && (
                        <img src={previewImage} alt="Preview" width="100" />
                    )}
                </div>
                <button type="submit" className='btn btn-primary'>Submit</button>
            </form>
        </>
    );
};

export default Upload;
