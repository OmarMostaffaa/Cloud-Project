import React, { useState, useEffect } from 'react';

function AddCarModal({ closeModal }) {
    const [formData, setFormData] = useState({
        id: '',
        brand: '',
        model: '',
        color: '',
        base64Image: null // New state for storing the base64 encoded image
    });

    const handleChange = (e) => {
        if (e.target.name === 'base64Image') {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, base64Image: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/cars/addCar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeModal();
                // Optionally, you can add logic to refresh car data here
            } else {
                console.error('Error adding car:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding car:', error.message);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.modal-content')) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={closeModal}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Car</h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="id" value={formData.id} onChange={handleChange} className="form-control mb-3" placeholder="ID" />
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-control mb-3" placeholder="Brand" />
                            <input type="text" name="model" value={formData.model} onChange={handleChange} className="form-control mb-3" placeholder="Model" />
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className="form-control mb-3" placeholder="Color" />
                            <input type="file" accept="image/jpeg" name="base64Image" onChange={handleChange} className="form-control mb-3" /> {/* File input for uploading image */}
                            <button type="submit" className="btn btn-primary">Add Car</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCarModal;
