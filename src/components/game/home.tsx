
import React from 'react';
import {Link} from 'react-router-dom';

export default function Home() {
    return (
        <nav>
        <ul>
          <li>
            <Link to="/offline-mode">Play offline on this screen</Link>
          </li>
          <li>
            <Link to="/online-mode">Enter lobby to play online</Link>
          </li>
        </ul>
      </nav>
    );
  };