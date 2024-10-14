import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ViewPage.css';

const ViewPage = () => {
  const [currentSection, setCurrentSection] = useState('income');
  const [sectionsData, setSectionsData] = useState({
    income: [],
    balance: [],
    cash: [],
    notes: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataAndDisplay(currentSection);
  }, [currentSection]);

  const fetchDataAndDisplay = async (sectionId) => {
    setIsLoading(true);
    let endpoint = '';

    switch (sectionId) {
      case 'income':
        endpoint = 'https://easydash.azurewebsites.net/api/IncomeStatementFinalData';
        break;
      case 'balance':
        endpoint = 'https://easydash.azurewebsites.net/api/SofpFinalData';
        break;
      case 'cash':
        endpoint = 'https://easydash.azurewebsites.net/api/GetCashFlowFinalData';
        break;
      case 'notes':
        endpoint = 'https://easydash.azurewebsites.net/api/GetNotesFinalData';
        break;
      default:
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setSectionsData(prev => ({ ...prev, [sectionId]: data }));
      } else {
        console.error('Unexpected data format:', data);
        setSectionsData(prev => ({ ...prev, [sectionId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSectionsData(prev => ({ ...prev, [sectionId]: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const transferData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://easydash.azurewebsites.net/api/ViewTest/calculateRatios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/charts');
      } else {
        throw new Error('Failed to calculate ratios');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while calculating ratios.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case 'income': return 'Income Statement';
      case 'balance': return 'Balance Sheet';
      case 'cash': return 'Cash Flow';
      case 'notes': return 'Notes';
      default: return 'Financial Statement';
    }
  };

  return (
    <div className="container1">
      <h1 className="page-title">{getSectionTitle(currentSection)}</h1>
      <div className="content-wrapper">
        <div className="section-selector">
          <h3>Select Section</h3>
          <ul>
            {['income', 'balance', 'cash', 'notes'].map((section) => (
              <li
                key={section}
                className={currentSection === section ? 'active' : ''}
                onClick={() => handleSectionChange(section)}
              >
                {getSectionTitle(section)}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <div className="table-container">
            <div className="table-scroll">
              <table className="financial-table">
                <thead>
                  <tr>
                    <th>LineItem</th>
                    <th>Notes</th>
                    <th>CY</th>
                    <th>PY</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionsData[currentSection].length > 0 ? (
                    sectionsData[currentSection].map((item) => (
                      <tr key={item.Id}>
                        <td>{item.LineItem}</td>
                        <td>{item.Notes}</td>
                        <td>{item.CY}</td>
                        <td>{item.PY}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No data available for this section.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button id="button" onClick={handleBack}>Back</button>
        <button id="button1" onClick={transferData}>Next</button>
      </div>

      {isLoading && (
        <div className="backdrop">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;