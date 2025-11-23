// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register-org">Register Org</Link>
        </>
      ) : (
        <>
          <Link to="/employees" style={{ marginRight: '10px' }}>Employees</Link>
          <Link to="/teams" style={{ marginRight: '10px' }}>Teams</Link>
          <Link to="/logs" style={{ marginRight: '10px' }}>Logs</Link>

          <button
            onClick={handleLogout}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #9ca3af',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
