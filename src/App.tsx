import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BlogPage } from './pages/BlogPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { FeasibilityStudiesPage } from './pages/FeasibilityStudiesPage';
import { FundingEntitiesPage } from './pages/FundingEntitiesPage';
import { HomePage } from './pages/HomePage';
import { ProductionLinesPage } from './pages/ProductionLinesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServicesPage } from './pages/ServicesPage';
import { StudyRequestWizardPage } from './pages/StudyRequestWizardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feasibility-studies" element={<FeasibilityStudiesPage />} />
            <Route path="/request-study" element={<StudyRequestWizardPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/production-lines" element={<ProductionLinesPage />} />
            <Route path="/funding-entities" element={<FundingEntitiesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/portal" element={<ClientPortalPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}
