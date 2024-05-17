import React from 'react';

function CarCard({ car, onUpdate, onDelete }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{car.model}</h5>
                <p className="card-text">Brand: {car.brand}</p>
                <p className="card-text">Color: {car.color}</p>
                <p className="card-text">Price: ${car.price}</p>
                <button onClick={() => onUpdate(car.id)} className="btn btn-primary">Update</button>
                <button onClick={() => onDelete(car.id)} className="btn btn-danger">Delete</button>
            </div>
        </div>
    );
}

export default CarCard;
