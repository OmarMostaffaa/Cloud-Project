import React, { useState, useEffect } from 'react';
import CarCard from './CarsCard';

function Cars() {
    const [cars, setCars] = useState([]);

    const fetchCarsFromBackend = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/cars/getCars');
            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching cars:', error.message);
        }
    };

    useEffect(() => {
        fetchCarsFromBackend();
    }, []);

    const handleUpdate = async (carId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/cars/${carId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* updated car data */ }),
            });
            if (response.ok) {
                fetchCarsFromBackend();
            } else {
                console.error('Error updating car:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating car:', error.message);
        }
    };

    const handleDelete = async (carId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/cars/${carId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCarsFromBackend();
            } else {
                console.error('Error deleting car:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting car:', error.message);
        }
    };

    return (
        <div className="container">
            <h1>Cars</h1>
            <div className="row">
                {cars.map(car => (
                    <div key={car.id} className="col-md-4 mb-3">
                        <CarCard car={car} onUpdate={() => handleUpdate(car.id)} onDelete={() => handleDelete(car.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cars;
