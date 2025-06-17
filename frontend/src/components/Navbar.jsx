import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#ddd' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
      <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
      <Link to="/config">Configurações</Link>
    </nav>
  );
}

export default Navbar;