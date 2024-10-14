import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartWrapper = ({ chart }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!chart || !chart.ChartType) {
      console.error('Invalid chart data:', chart);
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    const chartType = chart.ChartType.toLowerCase();
    const validChartTypes = ['line', 'bar', 'pie', 'doughnut', 'radar'];

    if (!validChartTypes.includes(chartType)) {
      console.error(`Chart type "${chartType}" is not valid.`);
      return;
    }

    console.log('Rendering chart:', chart);

    const chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: Object.keys(chart.Data || {}),
        datasets: [{
          label: chart.RatioName || 'Unnamed Chart',
          data: Object.values(chart.Data || {}),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [chart]);

  if (!chart || !chart.ChartType) {
    return <div>No chart data available</div>;
  }

  return (
    <div className="chart-wrapper" style={{ width: '100%', height: '300px' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ChartWrapper;