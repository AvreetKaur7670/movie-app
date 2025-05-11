import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchPersonDetails } from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    const loadPerson = async () => {
      try {
        const data = await fetchPersonDetails(id);
        setPerson(data);
        prepareChartData(data.roles);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Authentication required. Please log in to view this data.');
        } else {
          setError('Failed to load person details. Please try again later.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPerson();
  }, [id]);
  
  const prepareChartData = (roles) => {
    if (!roles || roles.length === 0) return;
    
    // Group ratings by range
    const ratingRanges = {
      '9-10': 0,
      '8-8.9': 0,
      '7-7.9': 0,
      '6-6.9': 0,
      '5-5.9': 0,
      'Below 5': 0
    };
    
    roles.forEach(role => {
      if (!role.imdbRating) return;
      
      const rating = parseFloat(role.imdbRating);
      
      if (rating >= 9) {
        ratingRanges['9-10']++;
      } else if (rating >= 8) {
        ratingRanges['8-8.9']++;
      } else if (rating >= 7) {
        ratingRanges['7-7.9']++;
      } else if (rating >= 6) {
        ratingRanges['6-6.9']++;
      } else if (rating >= 5) {
        ratingRanges['5-5.9']++;
      } else {
        ratingRanges['Below 5']++;
      }
    });
    
    const data = {
      labels: Object.keys(ratingRanges),
      datasets: [
        {
          label: 'Number of Movies',
          data: Object.values(ratingRanges),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    setChartData(data);
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'IMDb Rating Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
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
  
  if (!person) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Person not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col lg={8}>
          <h1>{person.name}</h1>
          <p>
            {person.birthYear && (
              <span><strong>Born:</strong> {person.birthYear} </span>
            )}
            {person.deathYear && (
              <span><strong>Died:</strong> {person.deathYear}</span>
            )}
          </p>
          
          <h3 className="mt-4">Filmography</h3>
          <ListGroup className="mb-4">
            {person.roles?.map((role, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to={`/movie/${role.movieId}`}>{role.movieName}</Link>
                  <div className="text-muted small">
                    <span className="me-2">{role.category}</span>
                    {role.characters && role.characters.length > 0 && (
                      <span>as {role.characters.join(', ')}</span>
                    )}
                  </div>
                </div>
                <Badge bg="primary" pill>
                  {role.imdbRating}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>Rating Distribution</Card.Header>
            <Card.Body>
              {chartData ? (
                <div style={{ height: '400px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              ) : (
                <p className="text-center">No rating data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PersonPage;