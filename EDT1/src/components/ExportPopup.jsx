import React from 'react';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';

const ExportPopup = ({ onClose, dashboardId }) => {

  const exportAsPDF = () => {
    const dashboard = document.querySelector(`[data-dashboard-id="${dashboardId}"]`);
    if (!dashboard) return;

    const exportButton = dashboard.querySelector(".export-btn");
    const dropdownButton = dashboard.querySelector(".dropdown-btn");

    if (exportButton) exportButton.style.display = "none";
    if (dropdownButton) dropdownButton.style.display = "none";

    const options = {
      margin: 0.5,
      filename: `dashboard_${dashboardId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    html2pdf().from(dashboard).set(options).save().then(() => {
      if (exportButton) exportButton.style.display = "";
      if (dropdownButton) dropdownButton.style.display = "";
    });
  };

  const exportAsWord = async () => {
    const dashboard = document.querySelector(`[data-dashboard-id="${dashboardId}"]`);
    if (!dashboard) return;

    const tempContainer = document.createElement("div");
    tempContainer.style.display = "flex";
    tempContainer.style.flexDirection = "row";
    tempContainer.style.flexWrap = "wrap";
    tempContainer.style.width = "100%";

    Array.from(dashboard.querySelectorAll(".chart-wrapper")).forEach(chartWrapper => {
      const chartClone = chartWrapper.cloneNode(true);
      tempContainer.appendChild(chartClone);
    });

    const imageData = await getImageData(tempContainer);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Dashboard ${dashboardId}`,
                bold: true,
                size: 48,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: imageData,
                transformation: {
                  width: 600,
                  height: 400,
                },
              }),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dashboard_${dashboardId}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const getImageData = (element) => {
    return new Promise((resolve, reject) => {
      import('html2canvas').then(html2canvas => {
        html2canvas.default(element, { scale: 2 })
          .then(canvas => {
            const dataUrl = canvas.toDataURL("image/png");
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            resolve(base64Data);
          })
          .catch(error => reject(error));
      });
    });
  };

  return (
    <div className="export-popup" onClick={(e) => { if (e.target.className === 'export-popup') onClose(); }}>
      <div className="export-popup-content">
        <h3>Choose Export Format</h3>
        <button className="export-popup-btn" onClick={exportAsPDF}>
          Export as PDF
        </button>
        <button className="export-popup-btn" onClick={exportAsWord}>
          Export as Word
        </button>
      </div>
    </div>
  );
};

export default ExportPopup;