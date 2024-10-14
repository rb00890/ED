import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import Popup from './Popup';
import ExportPopup from './ExportPopup';

const Dashboard = ({ id, isActive, chartData, updateChartData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [selectedRatios, setSelectedRatios] = useState([]);
  const [clientId, setClientId] = useState('1'); // Initialize with '1'

  useEffect(() => {
    const storedClientId = localStorage.getItem('selectedClientId');
    console.log('Stored ClientId:', storedClientId); // Debug log
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      localStorage.setItem('selectedClientId', '1');
      setClientId('1');
    }
  }, []);

  const loadCharts = (selectedRatios) => {
    // Filter chartData based on selectedRatios
    const chartsToLoad = selectedRatios.length && Array.isArray(chartData)
      ? chartData.filter(chart => selectedRatios.includes(chart.ratioName))
      : chartData;

    return Array.isArray(chartsToLoad) ? chartsToLoad : [];
  };

  const handleDisplay = (ratios) => {
    setSelectedRatios(ratios);
    setShowPopup(false);

    console.log('ClientId before API call:', clientId); // Debug log

    const requestData = {
      ClientId: "1",
      SelectedRatios: ratios,
    };

    console.log('Request data:', requestData); // Debug log

    fetch('https://easydash.azurewebsites.net/api/generateCharts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); // Debug log
        updateChartData(data);
      })
      .catch(error => console.error('Error generating charts:', error));
  };

  const handleExport = () => {
    setShowExportPopup(true);
  };

  const localChartData = loadCharts(selectedRatios);

  return (
    <div className="dashboard" style={{ display: isActive ? 'block' : 'none' }}>
      <button className="dropdown-btn" onClick={() => setShowPopup(true)}>
        Select Ratio
      </button>
      {localChartData.length > 0 ? (
        <div className="charts-container">
          {localChartData.map((chart, index) => (
            <ChartWrapper key={chart.RatioName || index} chart={chart} />
          ))}
        </div>
      ) : (
        <p>No charts to display. Please select ratios and generate charts.</p>
      )}
      <button className="export-btn" onClick={handleExport}>
        Export
      </button>
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onDisplay={handleDisplay}
        />
      )}
      {showExportPopup && (
        <ExportPopup onClose={() => setShowExportPopup(false)} dashboardId={id} />
      )}
    </div>
  );
};

export default Dashboard;