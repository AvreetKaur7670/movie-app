import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchMovies } from '../services/api';

const MoviesPage = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const loadMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMovies(title, year, page);
      setMovies(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [title, year]);
  
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    loadMovies(1); // Reset to first page on new search
  };
  
  const handlePrevPage = () => {
    if (pagination?.prevPage) {
      loadMovies(pagination.prevPage);
    }
  };
  
  const handleNextPage = () => {
    if (pagination?.nextPage) {
      loadMovies(pagination.nextPage);
    }
  };
  
  // Generate year options from 1990 to 2023
  const yearOptions = [];
  for (let y = 2023; y >= 1990; y--) {
    yearOptions.push(y);
  }

  return (
    <Container fluid>
      <h1 className="mb-4">Movie Database</h1>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={5}>
            <Form.Group controlId="title">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Search by title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group controlId="year">
              <Form.Label>Release Year</Form.Label>
              <Form.Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4} className="d-flex align-items-end">
            <Button type="submit" variant="primary" className="me-2">
              Search
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setTitle('');
                setYear('');
                loadMovies(1);
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      
      {!loading && movies.length === 0 && (
        <Alert variant="info">No movies found. Try adjusting your search criteria.</Alert>
      )}
      
      {!loading && movies.length > 0 && (
        <>
          <div className="movie-list">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card mb-3 p-3 border rounded bg-white shadow-sm">
                <h4>
                  <Link to={`/movie/${movie.imdbID}`}>{movie.title}</Link> <span className="text-muted">({movie.year})</span>
                </h4>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <span><strong>IMDB:</strong> {movie.imdbRating ?? 'N/A'}</span>
                  <span><strong>Rotten Tomatoes:</strong> {movie.rottenTomatoesRating ?? 'N/A'}</span>
                  <span><strong>Metacritic:</strong> {movie.metacriticRating ?? 'N/A'}</span>
                  <span><strong>Classification:</strong> {movie.classification ?? 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
          
          {pagination && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Showing {pagination.from + 1} to {pagination.to} of {pagination.total} movies
              </span>
              
              <div>
                <Button 
                  variant="outline-primary" 
                  onClick={handlePrevPage}
                  disabled={!pagination.prevPage}
                  className="me-2"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={handleNextPage}
                  disabled={!pagination.nextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default MoviesPage;
