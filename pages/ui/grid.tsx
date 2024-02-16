import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const GridPage: React.FC = () => {
  return (
    <div>
      <h1>Grid Page</h1>
      <Container>
        <Row>
          <Col xs="6" sm="4">1 of 2</Col>
          <Col xs="6" sm="4">2 of 2</Col>
        </Row>
        <Row>
          <Col xs="6" sm="4">1 of 3</Col>
          <Col xs="6" sm="4">2 of 3</Col>
          <Col xs="6" sm="4">3 of 3</Col>
        </Row>
      </Container>
    </div>
  );
};

export default GridPage;
