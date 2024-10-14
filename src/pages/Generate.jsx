import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Generate.css';

const Generate = () => {
  const [clients, setClients] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [calculatedRatios, setCalculatedRatios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    populateDropdown('https://easydash.azurewebsites.net/api/client', setClients);
    populateDropdown('https://easydash.azurewebsites.net/api/industry', setIndustries);
    populateDropdown('https://easydash.azurewebsites.net/api/category', setCategories);
    fetchCalculatedRatios();
  }, []);

  const populateDropdown = async (endpoint, setData) => {
    try {
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCalculatedRatios = async () => {
    try {
      const response = await axios.get('https://easydash.azurewebsites.net/api/getCalculatedRatios');
      setCalculatedRatios(response.data);
    } catch (error) {
      console.error('Error fetching calculated ratios:', error);
    }
  };

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleExportToPDF = () => {
    // Implement PDF export functionality
  };

  return (
    <div className="generate-container">
      <Link to="/choice_page" className="home-icon">
        <i className="fas fa-home"></i>
      </Link>
      
      <div className="dropdowns">
        <div className="dropdown">
          <label htmlFor="ClientDropDown">Client Name:</label>
          <select id="ClientDropDown">
            <option value="">Select Client</option>
            {clients.map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="industryDropdown">Industry:</label>
          <select id="industryDropdown">
            <option value="">Select Industry</option>
            {industries.map((industry, index) => (
              <option key={index} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="categoryDropdown">Category:</label>
          <select id="categoryDropdown">
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <h1>Calculated Ratios</h1>

      <div className="search-export">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search By Year"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <button onClick={handleExportToPDF}>Export to PDF</button>
      </div>

      {/* Table for calculated ratios would go here */}
    </div>
  );
};

export default Generate;