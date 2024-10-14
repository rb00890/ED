import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChoicePage.css'; // Adjust the path if necessary
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported

const ChoicePage = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="container-wrapper">
      <button
        id="Source_file"
        className="container-button"
        onClick={() => navigateTo('/upload_fs_sourceFile')}
      >
        <i className="fas fa-file-alt"></i>
        Source File
      </button>
      <button
        id="Charts"
        className="container-button"
        onClick={() => navigateTo('/Charts')}
      >
        <i className="fas fa-chart-line"></i>
        Charts
      </button>
      <button
        id="Ratios"
        className="container-button"
        onClick={() => navigateTo('/mainform')}
      >
        <i className="fas fa-percentage"></i>
        Ratios
      </button>
      <button
        id="Report"
        className="container-button"
        onClick={() => navigateTo('/view')}
      >
        <i className="fas fa-file-export"></i>
        View Statements
      </button>
    </div>
  );
};

export default ChoicePage;