// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh
    setError('');
    setLoading(true);

    try {
      // Calling my backend login API
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // backend returns { token: 'JWT_STRING', user: { ... } }
      const { token, user } = response.data;

      // Store token in localStorage so my api.js can use it
      localStorage.setItem('token', token);

      // Redirect after login
      navigate('/employees');
    } catch (err) {
      console.error(err);
      // Show a friendly error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>HRMS Login</h2>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Login to manage employees, teams, and logs.
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={styles.input}
            />
          </label>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          New organisation? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

// Simple inline styles to keep things clean
const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#fff',
    padding: '24px 28px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  input: {
    marginTop: '4px',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    marginTop: '8px',
    padding: '10px 12px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    background: '#2563eb',
    color: 'white',
  },
  errorBox: {
    marginBottom: '12px',
    padding: '8px 10px',
    borderRadius: '4px',
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: '14px',
  },
};

export default Login;
