import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from '@features/Upload/UploadPage';
import AssignmentNamePage from '@features/Assignment/AssignmentNamePage';
import AssignmentWeekPage from '@features/Assignment/AssignmentWeekPage';
import SimilarityLoadingPage from '@features/Similarity/SimilarityLoadingPage';
import SimilarityCompletePage from '@features/Similarity/SimilarityCompletePage';
import ResultPage from '@features/Result/ResultPage';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css';
import ComparePage from '@features/Compare/\bComparePage';
import PlagiarismDecisionPage from '@features/Result/PlagiarismDecisionPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssignmentNamePage />} />
        <Route path="/assignment/name" element={<AssignmentNamePage />} />
        <Route path="/assignment/week" element={<AssignmentWeekPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analysis/loading" element={<SimilarityLoadingPage />} />
        <Route path="/analysis/complete" element={<SimilarityCompletePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/compare/:from/:to" element={<ComparePage />} />
        <Route path="/decision" element={<PlagiarismDecisionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
