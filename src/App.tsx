import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from '@features/Upload/UploadPage';
import AssignmentNamePage from '@features/Assignment/AssignmentNamePage';
import AssignmentWeekPage from '@features/Assignment/AssignmentWeekPage';
import SimilarityLoadingPage from '@features/Similarity/SimilarityLoadingPage';
import SimilarityCompletePage from '@features/Similarity/SimilarityCompletePage';
import ResultPage from '@features/Result/ResultPage';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ComparePage from '@features/Compare/\bComparePage';
import PlagiarismDecisionPage from '@features/Result/PlagiarismDecisionPage';
import ResultSaveCompletePage from '@features/Result/ResultSaveCompletePage';
import DashboardPage from '@features/Dashboard/DashboardPage';
import LoginPage from '@features/Account/LoginPage';
import HomePage from '@features/Home/HomePage';
import SignupPage from '@features/Account/SignupPage';
import GlobalLoading from '@components/GlobalLoading';
import SubjectSelectPage from '@features/Assignment/SubjectSelectPage';

const App: React.FC = () => {
  return (
    <>
      <GlobalLoading />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assignment/subject" element={<SubjectSelectPage />} />
          <Route path="/assignment/name" element={<AssignmentNamePage />} />
          <Route path="/assignment/week" element={<AssignmentWeekPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis/loading" element={<SimilarityLoadingPage />} />
          <Route
            path="/analysis/complete"
            element={<SimilarityCompletePage />}
          />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/result/save" element={<ResultSaveCompletePage />} />
          <Route path="/compare/:from/:to" element={<ComparePage />} />
          <Route path="/decision" element={<PlagiarismDecisionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
