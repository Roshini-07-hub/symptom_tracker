import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/apiService';
import styles from './FileUpload.module.css';
import { FaFileUpload, FaTrash, FaSpinner } from 'react-icons/fa';

const acceptedReportTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif';
const allowedReportExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const allowedReportMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

const isAllowedReportFile = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return allowedReportMimes.includes(file.type) || allowedReportExtensions.includes(extension);
};

const getApiErrorMessage = (err, fallback) => {
  const details = err.response?.data?.errors;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(', ');
  }

  // Show debug info in development to help diagnose upload issues
  const debug = err.response?.data?.debug;
  const message = err.response?.data?.message || err.message || fallback;
  return debug ? `${message} (${debug})` : message;
};

/**
 * File Upload Component
 * Handles medical report file uploads
 */
const FileUpload = () => {
  const { t, language } = useLanguage();
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedReports, setUploadedReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const fetchUserReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const response = await apiService.reports.getUserReports(10, 0, language);
      setUploadedReports(response.data.data?.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  }, [language]);

  // Fetch user's reports on mount
  useEffect(() => {
    fetchUserReports();
  }, [fetchUserReports]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    setError('');
    setSuccess('');

    if (selectedFiles?.length > 0 && !isAllowedReportFile(selectedFiles[0])) {
      setError(t('upload.invalid_format'));
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setError(t('upload.file_required'));
      return;
    }

    if (!isAllowedReportFile(files[0])) {
      setError(t('upload.invalid_format'));
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('report', files[0]);
      formData.append('title', files[0].name);
      formData.append('category', 'general');
      formData.append('language', language);

      const response = await apiService.reports.uploadReport(formData);

      if (response.data.success) {
        setSuccess(t('upload.success'));
        setFiles(null);
        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError(getApiErrorMessage(err, t('upload.error')));
    } finally {
      setUploading(false);
      // Refresh reports list regardless of outcome so list stays in sync
      await fetchUserReports();
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm(t('confirm.delete') || 'Are you sure?')) {
      try {
        const response = await apiService.reports.deleteReport(reportId, language);
        if (response.data.success) {
          setSuccess(t('documents.delete_successful'));
          await fetchUserReports();
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Error deleting report'));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <h3>{t('upload.title') || 'Upload Medical Report'}</h3>
        <p>{t('upload.description') || 'Upload PDF, DOC, DOCX, or image files (Max 5MB)'}</p>

        <div className={styles.uploadArea}>
          <label className={styles.fileInput}>
            <FaFileUpload className={styles.icon} />
            <span>{t('upload.selectFile') || 'Select File'}</span>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept={acceptedReportTypes}
              disabled={uploading}
            />
          </label>

          {files && files.length > 0 && (
            <div className={styles.selectedFile}>
              <p>{files[0].name}</p>
              <small>({(files[0].size / 1024).toFixed(2)} KB)</small>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!files || files.length === 0 || uploading}
            className={styles.uploadBtn}
          >
            {uploading ? (
              <>
                <FaSpinner className={styles.spinner} />
                {t('common.loading') || 'Uploading...'}
              </>
            ) : (
              t('upload.button') || 'Upload'
            )}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
      </div>

      <div className={styles.reportsSection}>
        <h3>{t('reports.title') || 'Your Medical Reports'}</h3>

        {loadingReports ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <p>{t('common.loading')}</p>
          </div>
        ) : uploadedReports.length === 0 ? (
          <p className={styles.noReports}>{t('reports.empty') || 'No reports uploaded yet'}</p>
        ) : (
          <div className={styles.reportsList}>
            {uploadedReports.map((report) => (
              <div key={report._id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <h4>{report.title || report.fileName}</h4>
                  <small>
                    {new Date(report.createdAt).toLocaleDateString()} | {report.category}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(report._id)}
                  className={styles.deleteBtn}
                  title={t('common.delete') || 'Delete'}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
