// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';   
import Login from './pages/Login';
import RegisterOrg from './pages/RegisterOrg';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import EmployeeForm from './components/EmployeeForm';
import TeamForm from './components/TeamForm';
import Logs from './pages/Logs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Router>
      <div>
        <Navbar />
        {/* Simple top navigation for now */}
        {/* <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          {!token && <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>}
          {!token && <Link to="/register-org" style={{ marginRight: '10px' }}>Register Org</Link>}
          {token && (<button onClick={handleLogout}>Logout</button>)}
          {token && <Link to="/employees" style={{ marginRight: '10px' }}>Employees</Link>}
          {token && <Link to="/teams" style={{ marginRight: '10px' }}>Teams</Link>}
          {token && <Link to="/logs">Logs</Link>}
        </nav> */}

        <div style={{ padding: '0 20px' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register-org" element={<RegisterOrg />} />

            {/* Protected group */}
          <Route element={<ProtectedRoute />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />

            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/new" element={<TeamForm />} />
            <Route path="/teams/:id/edit" element={<TeamForm />} />

            <Route path="/logs" element={<Logs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
