import React from 'react';

function CarCard({ car, onUpdate, onDelete }) {
    return (
        <div className="card">
            <img src={car.imageUrl} className="card-img-top" alt={`${car.brand} ${car.model}`} />
            <div className="card-body">
                <h5 className="card-title">{car.brand} {car.model}</h5>
                <p className="card-text">Color: {car.color}</p>
                <button onClick={onUpdate} className="btn btn-primary">Update</button>
                <button onClick={onDelete} className="btn btn-danger">Delete</button>
            </div>
        </div>
    );
}


export default CarCard;