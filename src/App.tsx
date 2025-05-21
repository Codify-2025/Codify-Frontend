import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from '@features/Upload/UploadPage';
import AssignmentNamePage from '@features/Assignment/AssignmentNamePage';
import AssignmentWeekPage from '@features/Assignment/AssignmentWeekPage';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssignmentNamePage />} />
        <Route path="/assignment/week" element={<AssignmentWeekPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;
