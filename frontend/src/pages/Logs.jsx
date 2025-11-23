// src/pages/Logs.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simple filters (client-side)
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');

      // Backend: GET /api/logs  → frontend: api.get('/logs')
      const res = await api.get('/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load logs.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter logs 
  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter
      ? log.action?.toLowerCase().includes(actionFilter.toLowerCase())
      : true;

    const matchesUser = userFilter
      ? String(log.userId || '').includes(userFilter)
      : true;

    const created = log.createdAt ? new Date(log.createdAt) : null;

    const matchesFromDate = fromDate
        ? (created && created >= new Date(fromDate))
        : true;

    const matchesToDate = toDate
        ? (created && created <= new Date(toDate + 'T23:59:59'))
        : true;

    return matchesAction && matchesUser && matchesFromDate && matchesToDate;
  });

  const formatMeta = (meta) => {
    if (!meta) return '-';

    // If meta is object, show key: value pairs nicely
    if (typeof meta === 'object') {
      return Object.entries(meta).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ));
    }

    // If meta is string or something else
    return String(meta);
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Activity Logs</h2>
        <button onClick={fetchLogs} style={styles.refreshBtn}>
          Refresh
        </button>
      </div>

      <p style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
        View all important actions like employee creation, team updates, and team assignments.
      </p>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.filterItem}>
          <label style={styles.filterLabel}>Filter by Action</label>
          <input
            type="text"
            placeholder="e.g. employee_created"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.filterItem}>
          <label style={styles.filterLabel}>Filter by User ID</label>
          <input
            type="text"
            placeholder="e.g. 1"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.filterItem}>
            <label style={styles.filterLabel}>To Date</label>
            <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={styles.input}
            />
        </div>
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && filteredLogs.length === 0 && (
        <p>No logs found for the selected filters.</p>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Meta</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={styles.td}>{log.id}</td>
                <td style={styles.td}>
                  <code style={styles.actionCode}>{log.action}</code>
                </td>
                <td style={styles.td}>{log.userId ?? '-'}</td>
                <td style={styles.td}>
                  <div style={styles.metaBox}>
                    {formatMeta(log.meta)}
                  </div>
                </td>
                <td style={styles.td}>{formatDate(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    marginBottom: '8px',
  },
  refreshBtn: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #9ca3af',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filtersRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '180px',
  },
  filterLabel: {
    fontSize: '13px',
    color: '#4b5563',
  },
  input: {
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '8px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top',
  },
  error: {
    color: '#b91c1c',
    marginBottom: '8px',
  },
  metaBox: {
    fontFamily: 'monospace',
    fontSize: '12px',
    background: '#f9fafb',
    borderRadius: '4px',
    padding: '4px 6px',
  },
  actionCode: {
    fontFamily: 'monospace',
    fontSize: '12px',
    background: '#eff6ff',
    padding: '2px 4px',
    borderRadius: '3px',
  },
};

export default Logs;
