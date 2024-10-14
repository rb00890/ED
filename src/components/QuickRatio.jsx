import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/QuickRatio.css';

const QuickRatio = ({ onClose }) => {
    const [qratio, setQratio] = useState('');
    const [displayRatio, setDisplayRatio] = useState('');
    const [formuladisplay, setFormuladisplay] = useState('');
    const [industry, setIndustry] = useState('');
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [searchText, setSearchText] = useState('');
    const textareaRef = useRef(null);

    // Load initial data from localStorage and URL parameters
    useEffect(() => {
        const selectedRatio = localStorage.getItem('selectedRatioWithClient');
        const selectedFormula = localStorage.getItem('selectedFormula');

        const urlParams = new URLSearchParams(window.location.search);
        const selectedIndustry = urlParams.get('industry');
        const selectedCategory = urlParams.get('category');

        if (selectedRatio) {
            setQratio(selectedRatio);
            // Extract only the ratio name (remove the client ID)
            const ratioName = selectedRatio.split('-')[0];
            setDisplayRatio(ratioName);
        }
        setFormuladisplay(selectedFormula || '');
        setIndustry(selectedIndustry || '');
        setCategory(selectedCategory || '');
    }, []);

    // Fetch keywords from the server
    useEffect(() => {
        fetchKeywords();
    }, []);

    const fetchKeywords = async () => {
        try {
            const response = await axios.get('https://easydash.azurewebsites.net/api/keyword?');
            setKeywords(response.data);
        } catch (error) {
            console.error('Error fetching keywords:', error);
        }
    };

    // Handle saving ratio data
    const saveRatioData = async () => {
        const data = {
            Ratios: qratio,
            Formula: formuladisplay,
            Category: category,
            Industry: industry
        };

        try {
            const response = await axios.post('https://easydash.azurewebsites.net/api/SaveRatio?', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data saved successfully:', response.data);
            alert('Data saved successfully');
            onClose(); // Close the popup after successful save
        } catch (error) {
            console.error('Failed to save data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // Handle update button click
    const handleUpdateClick = () => {
        saveRatioData();
    };

    // Handle dragging keywords or operators
    const handleDragStart = (event, data) => {
        event.dataTransfer.setData('text/plain', data);
    };

    // Handle dropping into the formula textarea
    const handleDrop = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const textarea = textareaRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const formula = formuladisplay;
        const newText = formula.substring(0, startPos) + data + formula.substring(endPos);
        setFormuladisplay(newText);
    };

    // Allow dropping into the textarea
    const allowDrop = (event) => {
        event.preventDefault();
    };

    // Filter keywords based on search input
    const filteredKeywords = keywords.filter(keyword =>
        keyword.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="quick-ratio-modal">
            <button className="close-button" onClick={onClose}>&times;</button>
            <form id="form1" action="#">
                <div className="quickratio-main-container">
                    <div className="keyword-section">
                        <label id="ratio">Keywords</label>
                        <input
                            type="text"
                            id="searchBar"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <ul className="keyword-list-group" id="keywords1">
                            {filteredKeywords.map((keyword, index) => (
                                <li
                                    key={index}
                                    className="list-group-item"
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, keyword)}
                                >
                                    {keyword}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="ratio-section">
                        <div>
                            <label id="lbl_quickratio" htmlFor="qratio">Ratio Name</label>
                            <input
                                type="text"
                                id="qratio"
                                placeholder="Enter New Ratio Name"
                                value={displayRatio}
                                onChange={(e) => {
                                    setDisplayRatio(e.target.value);
                                    // Update qratio with the new value and preserve the client ID
                                    const clientId = qratio.split('-')[1];
                                    setQratio(`${e.target.value}-${clientId}`);
                                }}
                            />
                        </div>
                        <div>
                            <label id="lbl_nformula" htmlFor="formuladisplay">Formula</label>
                            {/* Display Formula */}
                            <textarea
                                id="formuladisplay"
                                className="form-control col-md-6 mt-3"
                                rows="3"
                                value={formuladisplay}
                                onChange={(e) => setFormuladisplay(e.target.value)}
                                onDragOver={allowDrop}
                                onDrop={handleDrop}
                                ref={textareaRef}
                            ></textarea>
                        </div>
                        <div className="operator-buttons">
                            {['+', '-', '/', '*', '(', ')'].map((operator, index) => (
                                <button
                                    key={index}
                                    className="operator-button"
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, operator)}
                                >
                                    {operator}
                                </button>
                            ))}
                        </div>
                        <button
                            id="update_button"
                            className="btn btn-danger"
                            onClick={handleUpdateClick}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default QuickRatio;