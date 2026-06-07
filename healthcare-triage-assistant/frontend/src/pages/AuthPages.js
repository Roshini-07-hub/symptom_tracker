import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './AuthPages.module.css';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const getAuthErrorMessage = (err, fallback) => {
  const details = err.response?.data?.errors;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(', ');
  }

  return err.response?.data?.message || err.message || fallback;
};

/**
 * Login Page
 */
const LoginPage = () => {
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>{t('auth.signInTitle')}</h1>
        <p className={styles.subtitle}>{t('auth.signInSubtitle')}</p>

        {error && <div className={styles.error}>{error || t('auth.loginFailed')}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>
              <FaEnvelope className={styles.icon} />
              {t('auth.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              <FaLock className={styles.icon} />
              {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? t('auth.signingIn') : t('auth.signInButton')}
          </button>
        </form>

        <p className={styles.link}>
          {t('auth.needAccountPrefix')} <Link to="/register">{t('auth.registerHere')}</Link>
        </p>
      </div>
    </div>
  );
};

/**
 * Register Page
 */
const RegisterPage = () => {
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: 'other'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.age ? parseInt(formData.age, 10) : undefined,
        formData.gender
      );
      navigate('/chat');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Registration failed'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>{t('auth.registerTitle')}</h1>
        <p className={styles.subtitle}>{t('auth.registerSubtitle')}</p>

        {error && <div className={styles.error}>{error || t('auth.registrationFailed')}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>
                <FaUser className={styles.icon} />
                {t('auth.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('auth.lastName')}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              <FaEnvelope className={styles.icon} />
              {t('auth.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              <FaLock className={styles.icon} />
              {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t('auth.age')}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('auth.gender')}</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccountButton')}
          </button>
        </form>

        <p className={styles.link}>
          {t('auth.haveAccountPrefix')} <Link to="/login">{t('auth.loginHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export { LoginPage, RegisterPage };
