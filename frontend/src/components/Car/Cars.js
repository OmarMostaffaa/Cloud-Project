import React, { useState, useEffect } from 'react';
import CarCard from './CarCard';

function Cars() {
    const [cars, setCars] = useState([]);
    const [carToUpdate, setCarToUpdate] = useState(null);

    const fetchCarsFromBackend = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/cars/getCars');
            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }
            const data = await response.json();
            const carsWithImageUrls = data.map(car => ({
                ...car,
                imageUrl: `http://${bucketName}.s3.amazonaws.com/${car.id}`
            }));
            setCars(carsWithImageUrls);
        } catch (error) {
            console.error('Error fetching cars:', error.message);
        }
    };

    useEffect(() => {
        fetchCarsFromBackend();
    }, []);

    const handleUpdateClick = (car) => {
        setCarToUpdate(car);
    };

    const handleDelete = async (carId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/cars/deleteCar/${carId}`, {
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
                        {carToUpdate && carToUpdate.id === car.id ? (
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="card-title">Update Car</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="brand" className="form-label">Brand:</label>
                                            <input type="text" id="brand" name="brand" className="form-control" defaultValue={carToUpdate.brand} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="model" className="form-label">Model:</label>
                                            <input type="text" id="model" name="model" className="form-control" defaultValue={carToUpdate.model} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="color" className="form-label">Color:</label>
                                            <input type="text" id="color" name="color" className="form-control" defaultValue={carToUpdate.color} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price:</label>
                                            <input type="text" id="price" name="price" className="form-control" defaultValue={carToUpdate.price} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="base64Image" className="form-label">Image:</label>
                                            <input type="file" id="base64Image" name="base64Image" className="form-control" accept="image/*" />
                                        </div>
                                        <div className="mb-3 d-flex justify-content-between">
                                            <button type="submit" className="btn btn-primary">Update</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setCarToUpdate(null)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <CarCard
                                car={car}
                                onUpdate={() => handleUpdateClick(car)}
                                onDelete={() => handleDelete(car.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cars;
