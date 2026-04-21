'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Brain } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import styles from './page.module.css';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t, tRaw } = useI18n();
  return (
    <div className={styles.container}>
      <PublicNavbar />

      {/* Hero Section */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>{t('home.badge')}</div>
            <h1 className={styles.title}>
              {t('home.heroTitlePrefix')} <br />
              <span className={styles.gradientText}>{t('home.heroTitleHighlight')}</span>
            </h1>
            <p className={styles.subtitle}>{t('home.heroSubtitle')}</p>

            <div className={styles.ctaGroup}>
              <Link href="/register" className={styles.primaryCta}>
                {t('home.ctaPrimary')} <ArrowRight size={20} />
              </Link>
              <Link href="#features" className={styles.secondaryCta}>
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <div className={styles.heroMockup}>
              {/* Fake dashboard mockup for visual appeal */}
              <div className={styles.mockupHeader}>
                <div className={styles.dots}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.fakeUrl}>app.kreavify.id/dashboard</div>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupSidebar}></div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupWidget}></div>
                  <div className={styles.mockupGrid}>
                    <div className={styles.mockupCard}></div>
                    <div className={styles.mockupCard}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decoration blur elements */}
            <div className={styles.blurBlue}></div>
            <div className={styles.blurPurple}></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <h2 className={styles.sectionTitle}>{t('home.featuresTitle')}</h2>
          <p className={styles.sectionSubtitle}>{t('home.featuresSubtitle')}</p>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <Zap size={24} />
              </div>
              <h3>{t('home.features.revenue.title')}</h3>
              <p>{t('home.features.revenue.desc')}</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <Shield size={24} />
              </div>
              <h3>{t('home.features.market.title')}</h3>
              <p>{t('home.features.market.desc')}</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.purple}`}>
                <Brain size={24} />
              </div>
              <h3>{t('home.features.invoice.title')}</h3>
              <p>{t('home.features.invoice.desc')}</p>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className={styles.valueProps}>
          <div className={styles.vpContainer}>
            <div className={styles.vpText}>
              <h2>{t('home.vpTitle')}</h2>
              <ul className={styles.checkList}>
                {(tRaw('home.vpItems') || []).map((text, idx) => (
                  <li key={idx}><CheckCircle size={20} className={styles.checkIcon} /> {text}</li>
                ))}
              </ul>
              <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                <strong>{t('home.vpNoteTitle')}</strong> {t('home.vpNoteText')}
              </p>
            </div>
            <div className={styles.vpImage}>
              <div className={styles.profileMockup}>
                <div className={styles.avatar}></div>
                <div className={styles.nameLine}></div>
                <div className={styles.descLine}></div>
                <div className={styles.gridMini}>
                  <div></div><div></div><div></div><div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
