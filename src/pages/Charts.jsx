import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Charts.css'; // Import the corresponding CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Charts = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState({});
    const [industries, setIndustries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ratios, setRatios] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRatios, setSelectedRatios] = useState([]);

    // Function to populate dropdowns
    const populateDropdown = async (endpoint, setData) => {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            // You can set an error state here to display to the user
        }
    };

    // Function to fetch ratios based on selected industry and category
    const populateRatioList = async () => {
        if (selectedIndustry && selectedCategory) {
            try {
                const response = await fetch(
                    `https://easydash.azurewebsites.net/api/ratios?industry=${selectedIndustry}&category=${selectedCategory}`
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRatios(data);
            } catch (error) {
                console.error('Error fetching ratios:', error);
                // Handle error: e.g., display a message to the user
            }
        } else {
            setRatios([]);
        }
    };

    // Handler for ratio selection
    const handleRatioSelection = (ratio) => {
        setSelectedRatios((prevRatios) =>
            prevRatios.includes(ratio)
                ? prevRatios.filter((r) => r !== ratio)
                : [...prevRatios, ratio]
        );
    };

    // Handler for Generate button click
    const handleGenerateButtonClick = async () => {
        if (!selectedClient) {
            alert('Please select a client.');
            return;
        }

        if (selectedRatios.length === 0) {
            alert('Please select at least one ratio.');
            return;
        }

        const requestData = {
            ClientId: "1",
            SelectedRatios: selectedRatios,
        };

        try {
            const response = await fetch('https://easydash.azurewebsites.net/api/generateCharts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('API response:', result);

                // Store data in localStorage
                localStorage.setItem('chartData', JSON.stringify(result));
                localStorage.setItem('selectedClientId', selectedClient);

                // Navigate to the GeneratedCharts page
                navigate('/generated_charts');
            } else {
                const error = await response.json();
                alert('Error: ' + (error.message || 'Unable to generate charts.'));
            }
        } catch (error) {
            console.error('Error generating charts:', error);
            alert('An error occurred while generating charts.');
        }
    };

    // useEffect to populate dropdowns on component mount
    useEffect(() => {
        populateDropdown('https://easydash.azurewebsites.net/api/client', setClients);
        populateDropdown('https://easydash.azurewebsites.net/api/industry', setIndustries);
        populateDropdown('https://easydash.azurewebsites.net/api/category', setCategories);
    }, []);

    // useEffect to populate ratios whenever industry or category changes
    useEffect(() => {
        populateRatioList();
    }, [selectedIndustry, selectedCategory]);

    return (
        <div className="container">
            <form id="form1">
                {/* Container for form elements */}
                <div className="mt-3 p-3 border rounded bg-light main-container">
                    {/* Navigation buttons */}
                    <div className="navigation-buttons d-flex justify-content-between mb-4">
                        <Link to="/choice_page" className="btn btn-primary">
                            <i className="fas fa-arrow-left"></i> Back
                        </Link>
                        <Link to="/generate" className="btn btn-primary">
                            <i className="fas fa-arrow-right"></i> Next
                        </Link>
                    </div>

                    {/* Industry and Category Selection */}
                    <div className="container mt-3 p-3 border rounded border-info bg-light">
                        <div className="row">
                            <div className="col-md-4 d-flex align-items-center">
                                <label htmlFor="ClientDropDown" className="me-2">
                                    Client Name:
                                </label>
                                <select
                                    id="ClientDropDown"
                                    className="form-select dropdown-style w-50"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                >
                                    <option value="">Select Client</option>
                                    {Object.entries(clients).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 d-flex align-items-center">
                                <label htmlFor="industryDropdown" className="me-2">
                                    Industry:
                                </label>
                                <select
                                    id="industryDropdown"
                                    className="form-select dropdown-style w-75"
                                    value={selectedIndustry}
                                    onChange={(e) => setSelectedIndustry(e.target.value)}
                                >
                                    <option value="">Select Industry</option>
                                    {industries.map((industry, index) => (
                                        <option key={index} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 d-flex align-items-center">
                                <label htmlFor="categoryDropdown" className="me-2">
                                    Category:
                                </label>
                                <select
                                    id="categoryDropdown"
                                    className="form-select dropdown-style w-75"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <br />

                    {/* Update Panel for dynamic updates */}
                    <div className="d-flex justify-content-between my-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="charts-list-group">
                                    <label htmlFor="ratio" className="float-start mb-2">
                                        Ratio
                                    </label>
                                    <div className="scrollable-list">
                                        <ul className="charts-list-group">
                                            {ratios.length > 0 ? (
                                                ratios.map((ratio, index) => (
                                                    <li
                                                        key={index}
                                                        className={`charts-list-group-item d-flex justify-content-between align-items-center ${
                                                            selectedRatios.includes(ratio) ? 'active' : ''
                                                        }`}
                                                        onClick={() => handleRatioSelection(ratio)}
                                                    >
                                                        {ratio}
                                                        <input
                                                            type="checkbox"
                                                            className="ratio-checkbox"
                                                            checked={selectedRatios.includes(ratio)}
                                                            readOnly
                                                        />
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="charts-list-group-item">No ratios available.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="text" id="ratio_id" hidden value="" className="form-control" />

                    {/* Buttons for generating data */}
                    <div className="d-flex justify-content-end mt-2 mb-5">
                        <button
                            id="generate"
                            className="btn btn-success center-text form-control w-25"
                            type="button"
                            onClick={handleGenerateButtonClick}
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Hidden Fields */}
                <button id="Button1" className="d-none" type="button"></button>
                <input id="HiddenField1" type="hidden" />
                <input id="HiddenField2" type="hidden" />
            </form>
        </div>
    );
};

export default Charts;