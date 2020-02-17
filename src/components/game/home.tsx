import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <Link to="/offline-mode">
        <Button>Play offline on this screen</Button>
      </Link>

      <Link to="/online-mode">
        <Button>Enter lobby to play online</Button>
      </Link>
    </div>
  );
}
