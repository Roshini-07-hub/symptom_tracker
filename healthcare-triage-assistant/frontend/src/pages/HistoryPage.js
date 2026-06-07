import React, { useState, useEffect } from 'react';
import { chatAPI } from '../services/apiService';
import styles from './HistoryPage.module.css';
import { FaHistory, FaCalendar } from 'react-icons/fa';

/**
 * History Page
 * Shows user's symptom report history
 */
const HistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await chatAPI.getHistory(20, 0);
      setReports(response.data.data.reports);
      setError('');
    } catch (err) {
      setError('Failed to load history');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading your history...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><FaHistory className={styles.icon} /> Your Health History</h1>
        <p>View your past symptom assessments</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {reports.length === 0 ? (
        <div className={styles.empty}>
          <p>No symptom reports yet. Start by checking your symptoms!</p>
        </div>
      ) : (
        <div className={styles.reportsList}>
          {reports.map((report) => (
            <div
              key={report._id}
              className={styles.reportCard}
              onClick={() => setSelectedReport(selectedReport?.id === report._id ? null : report)}
            >
              <div className={styles.reportHeader}>
                <div className={styles.reportInfo}>
                  <h3>Report from {formatDate(report.createdAt)}</h3>
                  <p className={styles.symptoms}>{report.symptoms.join(', ')}</p>
                </div>
                <div
                  className={styles.riskBadge}
                  style={{ backgroundColor: getRiskColor(report.riskLevel) }}
                >
                  {report.riskLevel?.toUpperCase()}
                </div>
              </div>

              {selectedReport?.id === report._id && (
                <div className={styles.reportDetails}>
                  <div className={styles.detailRow}>
                    <strong>Severity:</strong>
                    <span className={styles.capitalize}>{report.severity}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Duration:</strong>
                    <span>{report.duration}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Onset Date:</strong>
                    <span>
                      <FaCalendar className={styles.icon} />
                      {new Date(report.onsetDate).toLocaleDateString()}
                    </span>
                  </div>

                  {report.description && (
                    <div className={styles.detailRow}>
                      <strong>Description:</strong>
                      <span>{report.description}</span>
                    </div>
                  )}

                  {report.aiResponse && (
                    <div className={styles.aiResponse}>
                      <strong>AI Assessment:</strong>
                      <p>{report.aiResponse}</p>
                    </div>
                  )}

                  {report.recommendation && (
                    <div className={styles.recommendation}>
                      <strong>Recommendation:</strong>
                      <p className={styles.capitalize}>{report.recommendation.replace('-', ' ')}</p>
                    </div>
                  )}

                  {report.emergencyFlags && report.emergencyFlags.length > 0 && (
                    <div className={styles.warning}>
                      <strong>⚠️ Emergency Symptoms Detected:</strong>
                      <p>{report.emergencyFlags.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
