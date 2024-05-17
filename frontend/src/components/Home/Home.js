import React from 'react';

function Home() {
    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "15vh", paddingLeft: "35vw", paddingRight: "10vw" }}>
            <section className="intro-section text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <h1>Welcome to Our Car Dealership</h1>
                            <p>Discover a world of automotive excellence at our dealership. From sleek sedans to rugged SUVs, we offer a diverse selection of high-quality vehicles to suit every lifestyle and budget. Our knowledgeable team is dedicated to providing exceptional service, guiding you through every step of your car-buying journey with expertise and care. Visit us today and let us help you find the perfect vehicle to embark on your next adventure.</p>
                        </div>
                        <div className="col-md-6">
                            {/* You can add an image or carousel here */}
                        </div>
                    </div>
                </div>
            </section>
            {/* Add other sections/components here */}
        </div>
    );
}

export default Home;