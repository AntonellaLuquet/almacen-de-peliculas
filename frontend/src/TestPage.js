import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

/**
 * Página de prueba simple
 */
const TestPage = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>¡Aplicación funcionando correctamente!</Card.Title>
              <Card.Text>
                El frontend se está comunicando con el backend exitosamente.
              </Card.Text>
              <p><strong>Backend:</strong> http://localhost:8081/api</p>
              <p><strong>Frontend:</strong> http://localhost:3000</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestPage;