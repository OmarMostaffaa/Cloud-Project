import React, { useState, useEffect } from 'react';

function AddCarModal({ closeModal }) {
    const [formData, setFormData] = useState({
        id: '',
        brand: '',
        model: '',
        color: '',
        price: '',
        image: null // Store the selected image file
    });

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            // Handle image upload separately
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataWithoutImage = { ...formData };
            delete formDataWithoutImage.image; // Remove image from form data to prevent serialization issues

            // Example: Send form data to backend API (replace with your actual API endpoint)
            const response = await fetch('http://localhost:4000/api/addCar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithoutImage),
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
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control mb-3" placeholder="Price" />
                            {/* Add input for image upload */}
                            <input type="file" name="image" onChange={handleChange} className="form-control mb-3" accept="image/*" />
                            <button type="submit" className="btn btn-primary">Add Car</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCarModal;
