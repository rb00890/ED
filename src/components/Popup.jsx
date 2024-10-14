import React, { useState, useEffect } from 'react';

const Popup = ({ onClose, onDisplay }) => {
  const [ratios, setRatios] = useState([]);
  const [selectedRatios, setSelectedRatios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://easydash.azurewebsites.net/api/getCalculatedRatios')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched ratios:', data); // Debug log
        setRatios(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching ratios:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedRatios(prev =>
      checked ? [...prev, value] : prev.filter(ratio => ratio !== value)
    );
  };

  const handleDisplay = () => {
    onDisplay(selectedRatios);
  };

  if (isLoading) return <div>Loading ratios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="popup" onClick={(e) => { if (e.target.className === 'popup') onClose(); }}>
      <div className="popup-content">
        <h2>Select Ratios</h2>
        {ratios.length === 0 ? (
          <p>No ratios available</p>
        ) : (
          <div className="checkbox-list">
            {ratios.map(ratio => (
              <div key={ratio.RatioName} className="checkbox-container">
                <input
                  type="checkbox"
                  id={`ratio_${ratio.RatioName}`}
                  value={ratio.RatioName}
                  onChange={handleCheckboxChange}
                  checked={selectedRatios.includes(ratio.RatioName)}
                />
                <label htmlFor={`ratio_${ratio.RatioName}`}>{ratio.RatioName}</label>
              </div>
            ))}
          </div>
        )}
        <div className="button-container">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="display-btn" onClick={handleDisplay}>Display</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;