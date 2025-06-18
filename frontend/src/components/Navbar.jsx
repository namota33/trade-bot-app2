// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // (opcional para estilos)

function Navbar() {
  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <Link style={styles.link} to="/">Home</Link>
        </li>
        <li style={styles.li}>
          <Link style={styles.link} to="/dashboard">Dashboard</Link>
        </li>
        <li style={styles.li}>
          <Link style={styles.link} to="/config">Config</Link>
        </li>
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
  li: {},
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Navbar;