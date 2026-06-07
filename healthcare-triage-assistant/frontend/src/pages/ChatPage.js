import React, { useState } from 'react';
import { chatAPI } from '../services/apiService';
import SymptomForm from '../components/SymptomForm';
import ResultCard from '../components/ResultCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './ChatPage.module.css';
import { FaSpinner } from 'react-icons/fa';

const getApiErrorMessage = (err, fallback) => {
  const details = err.response?.data?.errors;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(', ');
  }

  return err.response?.data?.message || err.message || fallback;
};

/**
 * Chat/Symptom Intake Page
 */
const ChatPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSymptomSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await chatAPI.intakeSymptoms({
        symptoms: formData.symptoms,
        severity: formData.severity,
        duration: formData.duration,
        onsetDate: new Date(formData.onsetDate).toISOString(),
        description: formData.description,
        language: formData.language
      });

      setResult(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Error analyzing symptoms'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>{t('chat.pageTitle')}</h1>
          <p>{t('chat.pageDescription')}</p>
          {user && <span className={styles.user}>{t('chat.welcome').replace('{name}', user.firstName)}</span>}
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.mainContent}>
          <SymptomForm onSubmit={handleSymptomSubmit} loading={loading} />

          {loading && (
            <div className={styles.loadingContainer}>
              <FaSpinner className={styles.spinner} />
              <p>Analyzing your symptoms...</p>
            </div>
          )}

          {result && !loading && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
