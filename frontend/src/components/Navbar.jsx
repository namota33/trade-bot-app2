import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  console.log("Navbar carregado!"); // teste no console

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li><Link style={styles.link} to="/">Home</Link></li>
        <li><Link style={styles.link} to="/dashboard">Dashboard</Link></li>
        <li><Link style={styles.link} to="/config">Config</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1e1e1e',
    padding: '10px',
  },
  ul: {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Navbar;
