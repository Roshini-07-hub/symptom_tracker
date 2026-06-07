import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import styles from './ResultCard.module.css';

/**
 * Result Card Component
 * Displays symptom analysis results and recommendations
 */
const ResultCard = ({ result }) => {
  const { t } = useLanguage();

  if (!result) return null;

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'emergency': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'low': return <FaCheckCircle />;
      case 'moderate':
      case 'high':
        return <FaExclamationCircle />;
      case 'emergency': return <FaExclamationCircle />;
      default: return <FaInfoCircle />;
    }
  };

  const { data } = result;

  return (
    <div className={styles.container}>
      {data.emergencyAlert && (
        <div className={styles.emergency}>
          <div className={styles.emergencyIcon}>🚨</div>
          <div className={styles.emergencyContent}>
            <h3>{t('result.emergencyAlert')}</h3>
            <p>{t('result.emergencySymptoms')} {data.emergencySymptoms.join(', ')}</p>
            <p className={styles.emergencyAction}>{t('result.callEmergency')}</p>
          </div>
        </div>
      )}

      <div className={styles.riskSection}>
        <div className={styles.riskLevel} style={{ borderLeftColor: getRiskColor(data.report.riskLevel) }}>
          <div className={styles.riskIcon} style={{ color: getRiskColor(data.report.riskLevel) }}>
            {getRiskIcon(data.report.riskLevel)}
          </div>
          <div className={styles.riskContent}>
            <h3>{t('result.riskAssessment')} {data.report.riskLevel.toUpperCase()}</h3>
            <p>{data.report.reason}</p>
            <div className={styles.confidence}>
              {t('result.confidence')}: {(data.report.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4>{t('result.aiResponse')}</h4>
        <p className={styles.response}>{data.aiResponse}</p>
      </div>

      {data.recommendation && (
        <div className={styles.section}>
          <h4>{t('result.recommendation')} {data.recommendation.primary}</h4>
          <ul className={styles.actionsList}>
            {data.recommendation.actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
          <p className={styles.followUp}><strong>{t('result.followUp')}</strong> {data.recommendation.followUp}</p>
          <p className={styles.timeframe}><strong>{t('result.timeline')}</strong> {data.recommendation.timeframe}</p>
          {data.recommendation.warning && (
            <p className={styles.warning}>{data.recommendation.warning}</p>
          )}
        </div>
      )}

      <div className={styles.disclaimer}>
        <p>{data.disclaimer}</p>
      </div>
    </div>
  );
};

export default ResultCard;
