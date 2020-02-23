import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './login';
import Games from './lobby';

export default function OnlineModeEntry() {
  const [username, setUsername] = useState('');
  return username ? <Games username={username} /> : <Login login={setUsername} />;
}
