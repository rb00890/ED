import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Mainform.css'; // Import the corresponding CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import QuickRatio from '../components/QuickRatio'; // Adjust the path as necessary

const MainForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState({});
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratios, setRatios] = useState([]);
  const [selectedRatio, setSelectedRatio] = useState('');
  const [formula, setFormula] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRatioID, setSelectedRatioID] = useState('');
  const [qratio, setQratio] = useState(''); // New state for qratio

  // State to control QuickRatio modal visibility
  const [showQuickRatio, setShowQuickRatio] = useState(false);

  // Function to fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const clientResponse = await fetch('https://easydash.azurewebsites.net/api/client');
      const clientData = await clientResponse.json();
      setClients(clientData);

      const industryResponse = await fetch('https://easydash.azurewebsites.net/api/industry');
      const industryData = await industryResponse.json();
      setIndustries(industryData);

      const categoryResponse = await fetch('https://easydash.azurewebsites.net/api/category');
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Function to fetch ratios based on selected industry and category
  const fetchRatios = async () => {
    if (selectedIndustry && selectedCategory) {
      try {
        const response = await fetch(
          `https://easydash.azurewebsites.net/api/ratios?industry=${selectedIndustry}&category=${selectedCategory}`
        );
        const data = await response.json();
        setRatios(data);
      } catch (error) {
        console.error('Error fetching ratios:', error);
      }
    }
  };

  // Function to fetch Ratio ID
  const fetchRatioID = async (ratio) => {
    try {
      const response = await fetch(
        `/api/ViewTest/ratiosID?ratio=${ratio}&industry=${selectedIndustry}&category=${selectedCategory}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSelectedRatioID(data[0]);
      }
    } catch (error) {
      console.error('Error fetching Ratio ID:', error);
    }
  };

  // Function to fetch and display formula for a selected ratio
  const fetchFormulaAndDisplay = async (ratio) => {
    try {
      const baseUrl = 'https://easydash.azurewebsites.net/api';
      const response = await fetch(`${baseUrl}/formula?ratio=${ratio}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.text(); // Assuming formula is returned as plain text

      // Store the selected ratio in local storage
      localStorage.setItem('selectedRatio', ratio);

      // Store the selected formula in local storage
      localStorage.setItem('selectedFormula', data);

      // Get the selected client name from state
      console.log(selectedClient);

      // Concatenate the selected ratio with the selected client name
      const ratioWithClient = `${ratio}-${selectedClient}`;

      // Store the concatenated ratio name in local storage
      localStorage.setItem('selectedRatioWithClient', ratioWithClient);

      // Update state variables
      setFormula(data);
      setQratio(ratio); // Update qratio state

      // Optionally, update the hidden input if needed
      // If there's an input field for qratio, ensure it's bound to the qratio state
      // Otherwise, this step can be omitted as React manages the state
    } catch (error) {
      console.error('Error fetching formula:', error);
    }
  };

  // Function to handle Generate button click
  const handleGenerate = async () => {
    try {
      navigate('/generate');
      /*const response = await fetch('https://easydash.azurewebsites.net/api/getCalculatedRatios');
      const data = await response.json();
      const matchingRatio = data.find((ratioObj) => ratioObj.RatioName === selectedRatio);

      if (matchingRatio) {
        // Store necessary data in local storage
        localStorage.setItem('selectedClient', selectedClient);
        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('selectedIndustry', selectedIndustry);
        localStorage.setItem('selectedRatioID', selectedRatioID);
        localStorage.setItem('selectedRatio', selectedRatio);
        localStorage.setItem('selectedFormula', formula);

        // Optionally, store qratio if it's needed elsewhere
        localStorage.setItem('qratio', qratio);

        // Navigate to Generate page instead of GeneratedCharts
        navigate('/generate');
      } else {
        console.error('Selected ratio not found in the calculated ratios.');
      }*/
    } catch (error) {
      console.error('Error fetching calculated ratios:', error);
    }
  };

  // Function to handle Modify button click
  const handleModify = () => {
    if (selectedRatio && formula && selectedClient && selectedCategory && selectedIndustry) {
      const ratioWithClient = `${selectedRatio}-${selectedClient}`;
      localStorage.setItem('selectedRatioWithClient', ratioWithClient);

      // Open the QuickRatio modal instead of navigating
      setShowQuickRatio(true);
    } else {
      console.error('Please select a ratio, client, category, and industry before modifying.');
    }
  };

  // Function to close the QuickRatio modal
  const handleCloseQuickRatio = () => {
    setShowQuickRatio(false);
  };

  // Effect to fetch initial dropdown data
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Effect to fetch ratios whenever industry or category changes
  useEffect(() => {
    fetchRatios();
  }, [selectedIndustry, selectedCategory]);

  // Effect to fetch formula and ratio ID whenever a ratio is selected
  useEffect(() => {
    if (selectedRatio) {
      fetchFormulaAndDisplay(selectedRatio);
      fetchRatioID(selectedRatio);
    }
  }, [selectedRatio]);

  return (
    <form id="form1">
      {/* Main Container */}
      <div className="mt-3 p-3 border rounded bg-light main-container">
        {/* Navigation Buttons */}
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
            {/* Client Dropdown */}
            <div className="col-md-4 d-flex justify-content-center mb-3">
              <label htmlFor="ClientDropDown" className="align-self-center me-2">
                Client Name:
              </label>
              <select
                id="ClientDropDown"
                className="form-select dropdown-style w-50 border border-info rounded"
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

            {/* Industry Dropdown */}
            <div className="col-md-4 d-flex justify-content-center mb-3">
              <label htmlFor="industryDropdown" className="align-self-center me-2">
                Industry:
              </label>
              <select
                id="industryDropdown"
                className="form-select dropdown-style w-75 border border-info rounded"
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

            {/* Category Dropdown */}
            <div className="col-md-4 d-flex justify-content-center mb-3">
              <label htmlFor="categoryDropdown" className="align-self-center me-2">
                Category:
              </label>
              <select
                id="categoryDropdown"
                className="form-select dropdown-style w-75 border border-info rounded"
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

        {/* Ratio Selection and Formula Display */}
        <div className="d-flex justify-content-between my-3">
          {/* Ratio List */}
          <div className="row">
            <div className="col-md-6">
              <div className="list-group float-start">
                <label className="float-start">Ratio</label>
                <div className="scrollable-list">
                  <ul className="list-group overflow-auto" id="ratiok">
                    {ratios.map((ratio, index) => (
                      <li
                        key={index}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          selectedRatio === ratio ? 'active' : ''
                        }`}
                        onClick={() => setSelectedRatio(ratio)}
                      >
                        {ratio}
                        <input
                          type="checkbox"
                          className="ratio-checkbox"
                          checked={selectedRatio === ratio}
                          readOnly
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Formula Display */}
          <div className="col-md-6">
            <label htmlFor="formuladisplay" className="form-label">
              Display Formula
            </label>
            <textarea
              id="formuladisplay"
              className="form-control"
              rows="3"
              value={formula}
              readOnly
            ></textarea>
          </div>
        </div>

        {/* Hidden Ratio ID Field */}
        <input type="text" id="ratio_id" hidden value={selectedRatioID} className="form-control" />
        <input type="hidden" id="qratio" value={qratio} /> {/* New hidden input for qratio */}

        {/* Action Buttons */}
        <div className="d-flex justify-content-end mt-2 mb-5">
          <button
            id="modify"
            className="btn btn-danger form-control center-text w-25 me-2"
            type="button"
            onClick={handleModify}
          >
            Modify
          </button>
          <button
            id="generate"
            className="btn btn-success center-text form-control w-25"
            type="button"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>

        {/* QuickRatio Modal */}
        {showQuickRatio && (
          <div className="modal-overlay">
            <QuickRatio onClose={handleCloseQuickRatio} />
          </div>
        )}
      </div>

      {/* Hidden Fields */}
      <button id="Button1" className="d-none" type="button"></button>
      <input id="HiddenField1" type="hidden" />
      <input id="HiddenField2" type="hidden" />
    </form>
  );
};


export default MainForm;