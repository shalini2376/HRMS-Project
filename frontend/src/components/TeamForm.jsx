import { useEffect, useState } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import api from '../services/api';

function TeamForm() {

  const navigate = useNavigate();
  const {id} = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditMode) return ;

    const fetchTeam = async () => {
      try {
        setLoadingTeam(true);
        setError('');

        const res = await api.get(`/teams/${id}`);
        const team = res.data;

        setForm({
          name: team.name || '',
          description: team.description || '',
        });
      } catch (err) {
        console.error('Load team error:', err);
        setError('Failed to load team details.');
      } finally {
        setLoadingTeam(false);
      }
    }
    fetchTeam();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await api.put(`/teams/${id}`, form);
      } else {
        await api.post('/teams', form);
      }

      navigate('/teams');
    } catch (err) {
      console.error('Save team error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save team.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingTeam) {
    return <p style={{ padding: '20px' }}>Loading team...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isEditMode ? 'Edit Team' : 'Add Team'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Team Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={styles.textarea}
            />
          </label>

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate('/teams')}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? (isEditMode ? 'Saving...' : 'Creating...')
                : (isEditMode ? 'Save Changes' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  form: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  textarea: {
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    resize: 'vertical',
  },
  buttonRow: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  primaryButton: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #9ca3af',
    background: '#fff',
    color: '#374151',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: {
    color: '#b91c1c',
    fontSize: '14px',
  },
};

export default TeamForm;
