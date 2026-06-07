import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaHeartbeat, FaStethoscope, FaUsers, FaVials } from 'react-icons/fa';
import styles from './HomePage.module.css';

/**
 * Home Page
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <FaHeartbeat />,
      title: t('home.feature.symptomChecker'),
      description: t('home.feature.symptomCheckerDesc')
    },
    {
      icon: <FaStethoscope />,
      title: t('home.feature.guidance'),
      description: t('home.feature.guidanceDesc')
    },
    {
      icon: <FaVials />,
      title: t('home.feature.riskAssessment'),
      description: t('home.feature.riskAssessmentDesc')
    },
    {
      icon: <FaUsers />,
      title: t('home.feature.multilingual'),
      description: t('home.feature.multilingualDesc')
    }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
          <button onClick={() => navigate('/chat')} className={styles.ctaBtn}>
            {t('home.start')}
          </button>
        </div>
        <div className={styles.heroImage}>
          <FaHeartbeat className={styles.largeIcon} />
        </div>
      </section>

      <section className={styles.features}>
        <h2>{t('home.features')}</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.disclaimer}>
        <h2>{t('home.disclaimerTitle')}</h2>
        <p>{t('home.disclaimerLine1')}</p>
        <ul>
          <li>{t('home.disclaimerBullet1')}</li>
          <li>{t('home.disclaimerBullet2')}</li>
          <li>{t('home.disclaimerBullet3')}</li>
        </ul>
        <p>
          <strong>{t('home.disclaimerLine2')}</strong> {t('home.disclaimerEmergency')}
        </p>
      </section>
    </div>
  );
};

export default HomePage;
