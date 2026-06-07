import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/apiService';
import styles from './ProfilePage.module.css';
import { FaUser, FaEnvelope, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';

/**
 * Profile Page
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'other',
    medicalHistory: [],
    allergies: [],
    medicalHistoryInput: '',
    allergiesInput: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        age: user.age || '',
        gender: user.gender || 'other',
        medicalHistory: user.medicalHistory || [],
        allergies: user.allergies || []
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addToList = (type) => {
    const inputKey = `${type}Input`;
    if (formData[inputKey].trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], prev[inputKey].trim()],
        [inputKey]: ''
      }));
    }
  };

  const removeFromList = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await authAPI.updateProfile({
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        medicalHistory: formData.medicalHistory,
        allergies: formData.allergies
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Profile</h1>
        <p>Manage your health information</p>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.basicInfo}>
          <div className={styles.infoItem}>
            <FaUser className={styles.icon} />
            <div>
              <p className={styles.label}>Name</p>
              <p className={styles.value}>{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <FaEnvelope className={styles.icon} />
            <div>
              <p className={styles.label}>Email</p>
              <p className={styles.value}>{user.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label><FaBirthdayCake className={styles.icon} /> Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="150"
              />
            </div>

            <div className={styles.formGroup}>
              <label><FaVenusMars className={styles.icon} /> Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Medical History</label>
            <div className={styles.listInput}>
              <input
                type="text"
                name="medicalHistoryInput"
                value={formData.medicalHistoryInput}
                onChange={handleInputChange}
                placeholder="Add medical conditions..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('medicalHistory'))}
              />
              <button type="button" onClick={() => addToList('medicalHistory')} className={styles.addBtn}>
                Add
              </button>
            </div>

            <div className={styles.tags}>
              {formData.medicalHistory.map((item, idx) => (
                <span key={idx} className={styles.tag}>
                  {item}
                  <button type="button" onClick={() => removeFromList('medicalHistory', idx)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Allergies</label>
            <div className={styles.listInput}>
              <input
                type="text"
                name="allergiesInput"
                value={formData.allergiesInput}
                onChange={handleInputChange}
                placeholder="Add allergies..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('allergies'))}
              />
              <button type="button" onClick={() => addToList('allergies')} className={styles.addBtn}>
                Add
              </button>
            </div>

            <div className={styles.tags}>
              {formData.allergies.map((item, idx) => (
                <span key={idx} className={styles.tag}>
                  {item}
                  <button type="button" onClick={() => removeFromList('allergies', idx)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
