import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import styles from './ReportsPage.module.css';

/**
 * Reports Page
 * Handles medical report uploads and management
 */
const ReportsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>{t('reports.title') || 'Medical Reports'}</h1>
          <p>{t('reports.subtitle') || 'Upload and manage your medical documents'}</p>
          {user && <span className={styles.user}>{t('chat.welcome').replace('{name}', user.firstName)}</span>}
        </div>

        <FileUpload />
      </div>
    </div>
  );
};

export default ReportsPage;
