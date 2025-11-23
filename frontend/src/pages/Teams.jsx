import { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import api from '../services/api';

function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);           
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/teams');
            setTeams(res.data);
        } catch (err) {
            console.error('Error loading teams:',err);
            if (err.response?.data?.message) {
                setError(`Error ${err.response.status}: ${err.response.data.message}`);
            } else {
                setError('Failed to load teams.');
            }
        } finally {
            setLoading(false);
        }
    }; 

     const handleEdit = (id) => {
        navigate(`/teams/${id}/edit`);
    };

    const handleDelete = async (id) => {
        const sure = window.confirm('Delete this team? This cannot be undone.');
        if (!sure) return; 
        try{
            setDeletingId(id);
            await api.delete(`/teams/${id}`);
            await fetchTeams();
        } catch (err) {
            console.error('Delete team error:', err);
            alert('Failed to delete team.');
        } finally {
            setDeletingId(null);
        }
    }


    return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Teams</h2>
        <Link to="/teams/new" style={styles.addButton}>
          + Add Team
        </Link>
      </div>

      {loading && <p>Loading teams...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && teams.length === 0 && <p>No teams found.</p>}

      <div style={styles.list}>
        {teams.map(team => {
          const memberCount = team.Employees?.length || 0; 

          return (
            <div key={team.id} style={styles.card}>
              <h3>{team.name}</h3>
              <p style={{ marginBottom: '6px' }}>
                <strong>Description:</strong>{' '}
                {team.description || '—'}
              </p>
              <p>
                <strong>Members:</strong> {memberCount}
              </p>

              <div style={styles.actions}>
                <button
                  onClick={() => handleEdit(team.id)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  style={styles.deleteBtn}
                  disabled={deletingId === team.id}
                >
                  {deletingId === team.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  addButton: {
    background: '#2563eb',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    fontWeight: 600,
  },
  list: {
    display: 'grid',
    gap: '12px',
  },
  card: {
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  actions: {
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: 'none',
    background: '#f59e0b',
    color: '#fff',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: '#b91c1c',
  },
};

export default Teams;