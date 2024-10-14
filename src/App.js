import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadFsSourceFile from './pages/UploadFsSourceFile';
import Charts from './pages/Charts';
import GeneratedCharts from './pages/GeneratedCharts';
import ChoicePage from './pages/ChoicePage';
import MainForm from './pages/MainForm';
import View from './pages/ViewPage';
import QuickRatio from './components/QuickRatio';
import Generate from './pages/Generate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoicePage />} />
        <Route path="/upload_fs_sourceFile" element={<UploadFsSourceFile />} />
        <Route path="/Charts" element={<Charts />} />
        <Route path="/generated_charts" element={<GeneratedCharts />} />
        <Route path="/choice_page" element={<ChoicePage />} />
        <Route path="/mainform" element={<MainForm />} />
        <Route path="/view" element={<View />} />
        <Route path="/quickratio" element={<QuickRatio />} />
        <Route path="/generate" element={<Generate />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;