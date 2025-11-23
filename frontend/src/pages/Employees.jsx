import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Employees() {

  const [allTeams, setAllTeams] = useState([]);
  const [updatingAssignment, setUpdatingAssignment] = useState(false);
  const [openEmployeeId, setOpenEmployeeId] = useState(null);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');

      // GET /api/employees
      const response = await api.get('/employees');

      setEmployees(response.data); // backend returns an array
    } catch (err) {
      console.error(err);
      
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load employees.'}`);
      } else {
        setError('Failed to load employees.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
        const res = await api.get('/teams');
        setAllTeams(res.data);
    } catch (err) {
        console.error('Failed to load teams for assignment:', err);
    }
  };

   const toggleTeamsPanel = (id) => {
        setOpenEmployeeId(prev => (prev === id ? null : id));
    };

    const handleToggleTeam = async (employee, team, currentlyChecked) => {
  try {
    setUpdatingAssignment(true);

    if (currentlyChecked) {
      // Currently in team → unassign
      await api.delete(`/teams/${team.id}/unassign`, {
        data: { employeeId: employee.id },  // Axios allows body in DELETE like this
      });
    } else {
      // Not in team → assign
      await api.post(`/teams/${team.id}/assign`, {
        employeeId: employee.id,
      });
    }

    // After assignment change, refresh employees to get updated Teams
    await fetchEmployees();
  } catch (err) {
    console.error('Team assignment error:', err);
    alert('Failed to update team assignment.');
  } finally {
    setUpdatingAssignment(false);
  }
};


  const handleEdit = (id) => {
        navigate(`/employees/${id}/edit`)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try{
        setDeletingId(id);
        await api.delete(`/employees/${id}`);
        // refresh list
        await fetchEmployees();
    } catch (err) {
        console.error('Delete employee error: ', err);
        alert('Failed to delete employee.');
    } finally {
        setDeletingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Employees</h2>

      <div style={styles.headerRow}>
        <Link to="/employees/new" style={styles.addButton}>+ Add Employee</Link>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && employees.length === 0 && <p>No employees found.</p>}

      <div style={styles.list}>
        {employees.map((emp) => (
          <div key={emp.id} style={styles.card}>
            <h3>{emp.firstName} {emp.lastName}</h3>

            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>Phone:</strong> {emp.phone}</p>

            <p>
              <strong>Teams:</strong>{' '}
              {emp.Teams && emp.Teams.length > 0
                ? emp.Teams.map(t => t.name).join(', ')
                : 'No teams assigned'}
            </p>

            <div style={styles.actionRow}>
              <button style={styles.editBtn} onClick={() => handleEdit(emp.id)}>Edit</button>
              <button 
                style={styles.deleteBtn} 
                onClick={() => handleDelete(emp.id)} 
                disabled={deletingId === emp.id}
                >
                    {deletingId === emp.id ? 'Deleting...' : 'Delete'}
               </button>
               <button
                    style={styles.secondaryBtn}
                    onClick={() => toggleTeamsPanel(emp.id)}
                >
                    {openEmployeeId === emp.id ? 'Hide Teams' : 'Manage Teams'}
                </button>
            </div>
            {openEmployeeId === emp.id && (
  <div style={styles.teamsPanel}>
    <p><strong>Assign Teams:</strong></p>
    {allTeams.length === 0 ? (
      <p style={{ fontSize: '13px' }}>No teams available. Create a team first.</p>
    ) : (
      <div style={styles.checkboxList}>
        {allTeams.map(team => {
          const isChecked = emp.Teams?.some(t => t.id === team.id);

          return (
            <label key={team.id} style={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggleTeam(emp, team, isChecked)}
                disabled={updatingAssignment}
              />
              <span>{team.name}</span>
            </label>
          );
        })}
      </div>
    )}
  </div>
)}

          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  headerRow: {
    marginBottom: '20px',
  },
  addButton: {
    background: '#2563eb',
    color: 'white',
    padding: '8px 12px',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 600,
  },
  list: {
    display: 'grid',
    gap: '12px',
  },
  card: {
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: '#fff',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  editBtn: {
    padding: '6px 10px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 10px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#dc2626',
  },
  secondaryBtn: {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid #9ca3af',
  background: '#fff',
  color: '#374151',
  cursor: 'pointer',
},
teamsPanel: {
  marginTop: '10px',
  paddingTop: '10px',
  borderTop: '1px dashed #e5e7eb',
},
checkboxList: {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginTop: '4px',
},
checkboxItem: {
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
},

};

export default Employees;
