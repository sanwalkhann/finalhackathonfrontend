import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';

const CardsPage: React.FC = () => {
  return (
    <div>
      <h1>Cards Page</h1>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Card Title</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Card Subtitle
          </CardSubtitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardsPage;
