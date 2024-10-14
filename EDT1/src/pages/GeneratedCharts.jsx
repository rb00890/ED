import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import DashboardTab from '../components/DashboardTab';
import '../styles/GeneratedCharts.css';

const GeneratedCharts = () => {
  const [dashboards, setDashboards] = useState([{ id: 1 }]);
  const [activeDashboard, setActiveDashboard] = useState(1);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const storedClientId = localStorage.getItem('selectedClientId');
    console.log('GeneratedCharts - Stored ClientId:', storedClientId); // Debug log

    if (!storedClientId) {
      localStorage.setItem('selectedClientId', '1');
      console.log('GeneratedCharts - Setting ClientId to 1'); // Debug log
    }

    const storedChartData = localStorage.getItem('chartData');
    if (storedChartData) {
      setChartData(JSON.parse(storedChartData));
    } else {
      console.error('No chart data found in local storage.');
    }
  }, []);

  const addDashboard = () => {
    const newId = dashboards.length + 1;
    setDashboards([...dashboards, { id: newId }]);
    setActiveDashboard(newId);
  };

  const removeDashboard = (id) => {
    const updatedDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(updatedDashboards);
    if (activeDashboard === id && updatedDashboards.length > 0) {
      setActiveDashboard(updatedDashboards[0].id);
    }
  };

  const updateChartData = (data) => {
    setChartData(data);
    localStorage.setItem('chartData', JSON.stringify(data));
  };

  const exportAllDashboardsAsPDF = async () => {
    // Implement PDF export logic similar to the provided JavaScript
  };

  const exportAllDashboardsAsWord = async () => {
    // Implement Word export logic similar to the provided JavaScript
  };

  return (
    <div className="generated-charts">
      <div className="dashboard-tabs">
        {dashboards.map(dashboard => (
          <DashboardTab
            key={dashboard.id}
            id={dashboard.id}
            isActive={activeDashboard === dashboard.id}
            onClick={() => setActiveDashboard(dashboard.id)}
            onClose={() => removeDashboard(dashboard.id)}
          />
        ))}
      </div>
      <button className="new-dashboard-btn" onClick={addDashboard}>
        + New Dashboard
      </button>
      <div className="dashboard-container">
        {dashboards.map(dashboard => (
          <Dashboard
            key={dashboard.id}
            id={dashboard.id}
            isActive={activeDashboard === dashboard.id}
            chartData={chartData}
            updateChartData={updateChartData}
          />
        ))}
      </div>
      <button id="downloadAllDashboardsBtn" onClick={exportAllDashboardsAsPDF}>
        Download All Dashboards
      </button>
    </div>
  );
};

export default GeneratedCharts;