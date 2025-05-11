import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <div className="text-center">
            <h1>Welcome to the Movie Database</h1>
            <p className="lead">
              Explore our collection of movies from 1990 to 2023. Search for your favorites and discover new films.
            </p>
          </div>
        </Col>
      </Row>
      
      <Row className="my-5">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Img 
              variant="top" 
              src="https://images.unsplash.com/photo-1542204165-65bf26472b9b" 
              alt="Movie posters" 
            />
            <Card.Body>
              <Card.Title>Browse Movies</Card.Title>
              <Card.Text>
                Search our extensive database of movies. Filter by title, year, and more.
              </Card.Text>
              <Button variant="primary" as={Link} to="/movies">
                Browse Movies
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Img 
              variant="top" 
              src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf" 
              alt="People in the film industry" 
            />
            <Card.Body>
              <Card.Title>Explore Film Professionals</Card.Title>
              <Card.Text>
                Learn about directors, actors, and other film professionals. 
                {' '}<strong>Login required to access this feature.</strong>
              </Card.Text>
              <Button variant="secondary" as={Link} to="/login">
                Login to Explore
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;