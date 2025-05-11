import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Badge, ListGroup, 
  Spinner, Alert, Table
} from 'react-bootstrap';
import { fetchMovieDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MovieDetailsPage = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(imdbID);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovie();
  }, [imdbID]);
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  if (!movie) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={4} className="mb-4">
          {movie.poster ? (
            <Card>
              <Card.Img variant="top" src={movie.poster} alt={`Poster for ${movie.title}`} />
            </Card>
          ) : (
            <Card className="text-center p-5">
              <div className="my-5">
                <h3>No Poster Available</h3>
              </div>
            </Card>
          )}
          
          <Card className="mt-3">
            <Card.Header>Ratings</Card.Header>
            <ListGroup variant="flush">
              {movie.ratings?.map((rating, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between">
                  <span>{rating.source}</span>
                  <Badge bg="primary">{rating.value}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        
        <Col md={8}>
          <h1>{movie.title} <span className="text-muted">({movie.year})</span></h1>
          
          <div className="mb-3">
            {movie.genres?.map((genre, index) => (
              <Badge key={index} bg="secondary" className="me-2">{genre}</Badge>
            ))}
            {movie.runtime && <span className="ms-2">{movie.runtime} min</span>}
            {movie.classification && <Badge bg="info" className="ms-2">{movie.classification}</Badge>}
          </div>
          
          {movie.boxoffice && (
            <p><strong>Box Office:</strong> ${new Intl.NumberFormat().format(movie.boxoffice)}</p>
          )}
          
          {movie.country && (
            <p><strong>Country:</strong> {movie.country}</p>
          )}
          
          {movie.plot && (
            <Card className="mb-4">
              <Card.Header>Plot</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
              </Card.Body>
            </Card>
          )}
          
          <h3>Cast & Crew</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Character(s)</th>
              </tr>
            </thead>
            <tbody>
              {movie.principals?.map((person, index) => (
                <tr key={index}>
                  <td>
                    {isAuthenticated ? (
                      <Link to={`/person/${person.id}`}>{person.name}</Link>
                    ) : (
                      <span>
                        {person.name} <small className="text-muted">(Login to view details)</small>
                      </span>
                    )}
                  </td>
                  <td>{person.category}</td>
                  <td>
                    {person.characters && person.characters.length > 0 
                      ? person.characters.join(', ') 
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetailsPage;