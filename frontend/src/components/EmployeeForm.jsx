
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../services/api'

function EmployeeForm() {
    const navigate = useNavigate();
    const {id} = useParams();  // undefined for /employees/new
    const isEditMode = Boolean(id)

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    })
    const [loading, setLoading] = useState(false);
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const [error, setError] = useState('');

    // if request is for editing then I have to fetch existing employee data
    useEffect(() => {
        if(!isEditMode) return ;

        const fetchEmployee = async () => {
            try {
                setLoadingEmployee(true);
                setError('');

                const res = await api.get(`/employees/${id}`);
                const emp = res.data;

                setForm({
                    firstName: emp.firstName || '',
                    lastName: emp.lastName || '',
                    email: emp.email || '',
                    phone: emp.phone || '',
                });
            }catch(err){
                console.error('Failed to load employee', err)
                setError('Failed to load employee details.');
            } finally {
                setLoadingEmployee(false);
            }
        };
        fetchEmployee();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true);

        try {
            if (isEditMode) {
                // UPDATE Employee
                await api.put(`/employees/${id}`, form);
            } else {
                // CREATE employee
                await api.post('/employees', form);
            }
            navigate('/employees');
        } catch (err) {
            console.error('Save employee error:', err)
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to save employee.');
            }
        }  finally {
            setLoading(false);
        }
    }; 

    if (loadingEmployee) {
        return <p style={{ padding: '20px' }}>Loading employee...</p>;
    }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isEditMode ? 'Edit Employee' : 'Add Employee'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            First Name
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Last Name
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Phone
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate('/employees')}
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
                : (isEditMode ? 'Save Changes' : 'Create Employee')}
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

export default EmployeeForm;
