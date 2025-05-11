import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/Navigation/Navbar';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PersonPage from './pages/PersonPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Container className="mt-4" fluid>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/person/:id" element={
              <ProtectedRoute>
                <PersonPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;