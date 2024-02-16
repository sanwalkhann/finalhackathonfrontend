import React from 'react';
import { Button } from 'reactstrap';

const ButtonsPage: React.FC = () => {
  return (
    <div>
      <h1>Buttons Page</h1>
      <Button color="primary">Primary Button</Button>{' '}
      <Button color="secondary">Secondary Button</Button>{' '}
      <Button color="success">Success Button</Button>{' '}
      <Button color="danger">Danger Button</Button>{' '}
      <Button color="warning">Warning Button</Button>{' '}
      <Button color="info">Info Button</Button>{' '}
      <Button color="light">Light Button</Button>{' '}
      <Button color="dark">Dark Button</Button>{' '}
      <Button color="link">Link Button</Button>{' '}
    </div>
  );
};

export default ButtonsPage;
