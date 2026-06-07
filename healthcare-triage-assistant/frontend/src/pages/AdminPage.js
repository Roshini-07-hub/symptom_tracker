import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/apiService';
import styles from './AdminPage.module.css';
import { FaUsers, FaHeartbeat, FaChartBar, FaExclamationCircle } from 'react-icons/fa';

/**
 * Admin Dashboard Page
 */
const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats(30);
      setStats(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading dashboard...</p></div>;
  }

  if (!stats) {
    return <div className={styles.container}><p>No data available</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Monitor system health and user activity</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FaUsers className={styles.statIcon} style={{ color: '#2563eb' }} />
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Users</p>
            <p className={styles.statValue}>{stats.users?.total || 0}</p>
            <p className={styles.statSubtext}>+{stats.users?.new || 0} this month</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <FaHeartbeat className={styles.statIcon} style={{ color: '#ef4444' }} />
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Reports</p>
            <p className={styles.statValue}>{stats.reports?.total || 0}</p>
            <p className={styles.statSubtext}>+{stats.reports?.new || 0} this month</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <FaExclamationCircle className={styles.statIcon} style={{ color: '#f59e0b' }} />
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Emergency Cases</p>
            <p className={styles.statValue}>{stats.reports?.emergencyCases || 0}</p>
            <p className={styles.statSubtext}>This month</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <FaChartBar className={styles.statIcon} style={{ color: '#10b981' }} />
          <div className={styles.statContent}>
            <p className={styles.statLabel}>High Risk Cases</p>
            <p className={styles.statValue}>{stats.riskDistribution?.find(r => r._id === 'high')?.count || 0}</p>
            <p className={styles.statSubtext}>Requires attention</p>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <h2>Risk Distribution</h2>
          <div className={styles.riskList}>
            {stats.riskDistribution?.map((risk) => (
              <div key={risk._id} className={styles.riskItem}>
                <span className={styles.riskLabel}>{risk._id?.toUpperCase() || 'Unknown'}</span>
                <div className={styles.riskBar}>
                  <div
                    className={styles.riskFill}
                    style={{
                      width: `${(risk.count / (stats.reports?.total || 1)) * 100}%`,
                      backgroundColor: getRiskColor(risk._id)
                    }}
                  />
                </div>
                <span className={styles.riskCount}>{risk.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Top Symptoms</h2>
          <div className={styles.symptomList}>
            {stats.commonSymptoms?.slice(0, 5).map((symptom, idx) => (
              <div key={idx} className={styles.symptomItem}>
                <span className={styles.symptomName}>{symptom._id}</span>
                <span className={styles.symptomCount}>{symptom.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>Activity Summary</h2>
        <div className={styles.activityGrid}>
          {stats.auditSummary?.map((activity) => (
            <div key={activity._id} className={styles.activityItem}>
              <p className={styles.activityLabel}>{activity._id?.replace('-', ' ')}</p>
              <p className={styles.activityCount}>{activity.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getRiskColor = (level) => {
  switch(level) {
    case 'low': return '#10b981';
    case 'moderate': return '#f59e0b';
    case 'high': return '#ef4444';
    case 'emergency': return '#dc2626';
    default: return '#6b7280';
  }
};

export default AdminPage;
