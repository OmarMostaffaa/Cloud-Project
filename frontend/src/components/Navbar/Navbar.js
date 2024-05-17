import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import AddCarModal from '../Car/AddCarModal'; // Import the AddCarModal component

function Navbar() {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#">Car Dealership</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/Cars">Cars</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-primary" onClick={openModal}>Add Car</button>
                        </li>
                    </ul>
                </div>
            </div>
            {showModal && <AddCarModal closeModal={closeModal} />} {/* Render the modal here */}
        </nav>
    );
}

export default Navbar;