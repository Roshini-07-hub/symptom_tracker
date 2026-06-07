import React, { useState } from 'react';
import { FaExclamationTriangle, FaHeartbeat } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import styles from './SymptomForm.module.css';

/**
 * Symptom Form Component
 * Collects symptom information from user
 */
const SymptomForm = ({ onSubmit, loading }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    symptoms: [],
    symptomInput: '',
    severity: 'moderate',
    duration: '',
    onsetDate: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSymptom = () => {
    if (formData.symptomInput.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, prev.symptomInput.trim()],
        symptomInput: ''
      }));
    }
  };

  const removeSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.symptoms.length === 0) {
      newErrors.symptoms = t('validation.symptoms');
    }

    if (!formData.duration) {
      newErrors.duration = t('validation.duration');
    }

    if (!formData.onsetDate) {
      newErrors.onsetDate = t('validation.onsetDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      language
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.disclaimer}>
        <FaExclamationTriangle className={styles.icon} />
        <p>{t('chat.disclaimer')}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaHeartbeat className={styles.inputIcon} />
            {t('chat.symptoms')}
          </label>

          <div className={styles.symptomInput}>
            <input
              type="text"
              value={formData.symptomInput}
              onChange={(e) => setFormData(prev => ({ ...prev, symptomInput: e.target.value }))}
              placeholder={t('chat.symptomPlaceholder')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
            />
            <button
              type="button"
              onClick={addSymptom}
              className={styles.addBtn}
            >
              {t('chat.add')}
            </button>
          </div>

          <div className={styles.symptomTags}>
            {formData.symptoms.map((symptom, index) => (
              <span key={index} className={styles.tag}>
                {symptom}
                <button
                  type="button"
                  onClick={() => removeSymptom(index)}
                  className={styles.removeBtn}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {errors.symptoms && <span className={styles.error}>{t('validation.symptoms')}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{t('chat.severity')}</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="mild">{t('chat.severity.mild')}</option>
              <option value="moderate">{t('chat.severity.moderate')}</option>
              <option value="severe">{t('chat.severity.severe')}</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('chat.duration')}</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder={t('chat.durationPlaceholder')}
              className={styles.input}
            />
            {errors.duration && <span className={styles.error}>{t('validation.duration')}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('chat.onsetDate')}</label>
          <input
            type="date"
            name="onsetDate"
            value={formData.onsetDate}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.onsetDate && <span className={styles.error}>{t('validation.onsetDate')}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('chat.description')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t('chat.descriptionPlaceholder')}
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? t('chat.loading') : t('chat.submit')}
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;
