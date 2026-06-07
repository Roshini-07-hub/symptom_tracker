import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaHeartbeat, FaSignOutAlt, FaUser } from 'react-icons/fa';
import styles from './Header.module.css';

/**
 * Header Component
 * Navigation and branding header
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { language, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FaHeartbeat className={styles.icon} />
          <span>HealthTriage AI</span>
        </Link>

        <nav className={styles.nav}>
          {user && (
            <>
              <Link to="/chat" className={styles.navLink}>
                {t('nav.chat')}
              </Link>
              <Link to="/history" className={styles.navLink}>
                {t('nav.history')}
              </Link>
              <Link to="/reports" className={styles.navLink}>
                {t('nav.reports')}
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className={styles.navLink}>
                  {t('nav.admin')}
                </Link>
              )}
            </>
          )}
        </nav>

        <div className={styles.rightSection}>
          <div className={styles.languageSelector}>
            <button 
              className={language === 'en' ? styles.active : ''}
              onClick={() => switchLanguage('en')}
            >
              EN
            </button>
            <button 
              className={language === 'hi' ? styles.active : ''}
              onClick={() => switchLanguage('hi')}
            >
              HI
            </button>
            <button 
              className={language === 'te' ? styles.active : ''}
              onClick={() => switchLanguage('te')}
            >
              TE
            </button>
          </div>

          {user ? (
            <div className={styles.userMenu}>
              <Link to="/profile" className={styles.userProfile}>
                <FaUser className={styles.icon} />
                <span>{user.firstName}</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <FaSignOutAlt className={styles.icon} />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.btn}>
                {t('auth.login')}
              </Link>
              <Link to="/register" className={`${styles.btn} ${styles.primary}`}>
                {t('auth.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
