import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Discovery from './pages/Discovery';
import Feed from './pages/Feed';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import Studio from './pages/Studio';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Discovery />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photo/:id" element={<PhotoDetail />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
