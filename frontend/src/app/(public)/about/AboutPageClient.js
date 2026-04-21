'use client';

import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import styles from './page.module.css';
import Link from 'next/link';
import { Target, Eye, Lightbulb, FileText, ScrollText, Bot, BarChart2, LayoutDashboard, TrendingUp, MapPin } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '@/lib/i18n';

const featureCards = [
    { id: 'revenue', Icon: TrendingUp },
    { id: 'pricing', Icon: Bot },
    { id: 'invoice', Icon: FileText },
    { id: 'analytics', Icon: BarChart2 },
    { id: 'portfolio', Icon: LayoutDashboard },
    { id: 'contract', Icon: ScrollText },
];

export default function AboutPageClient() {
    const { t } = useI18n();

    return (
        <>
            <PublicNavbar />
            <div className={styles.pageWrapper}>
                <div className={styles.hero}>
                    <div className={styles.heroInner}>
                        <div className={styles.heroLottie}>
                            <DotLottieReact
                                src="/about.lottie"
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className={styles.heroContent}>
                            <span className={styles.pill}>{t('publicPages.about.pill')}</span>
                            <h1 className={styles.heroTitle}>{t('publicPages.about.title')}</h1>
                            <p className={styles.heroSubtitle}>{t('publicPages.about.subtitle')}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Mission */}
                    <section>
                        <div className={styles.missionGrid}>
                            <div className={styles.missionCard} style={{ '--accent': '#4f46e5' }}>
                                <div className={styles.missionIcon}><Target size={22} /></div>
                                <h3>{t('publicPages.about.missionTitle')}</h3>
                                <p>{t('publicPages.about.missionDesc')}</p>
                            </div>
                            <div className={styles.missionCard} style={{ '--accent': '#7c3aed' }}>
                                <div className={styles.missionIcon}><Eye size={22} /></div>
                                <h3>{t('publicPages.about.visionTitle')}</h3>
                                <p>{t('publicPages.about.visionDesc')}</p>
                            </div>
                            <div className={styles.missionCard} style={{ '--accent': '#2563eb' }}>
                                <div className={styles.missionIcon}><Lightbulb size={22} /></div>
                                <h3>{t('publicPages.about.valuesTitle')}</h3>
                                <p>{t('publicPages.about.valuesDesc')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className={styles.statsSection}>
                        <div className={styles.statsGrid}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>6+</span>
                                <span className={styles.statLabel}>{t('publicPages.about.stats.features')}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>AI</span>
                                <span className={styles.statLabel}>{t('publicPages.about.stats.powered')}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>{t('publicPages.about.stats.free')}</span>
                            </div>
                            <div className={styles.stat}>
                                <MapPin size={28} className={styles.statIcon} />
                                <span className={styles.statLabel}>{t('publicPages.about.stats.madeFor')}</span>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section>
                        <h2 className={styles.sectionTitle}>{t('publicPages.about.featuresTitle')}</h2>
                        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>
                            <strong>{t('publicPages.about.noteTitle')}</strong> {t('publicPages.about.noteText')}
                        </p>
                        <div className={styles.featureGrid}>
                            {featureCards.map((f) => (
                                <div key={f.id} className={styles.featureCard}>
                                    <div className={styles.featureIconWrap}>
                                        <f.Icon size={20} />
                                    </div>
                                    <h3>{t(`publicPages.about.featureCards.${f.id}.title`)}</h3>
                                    <p>{t(`publicPages.about.featureCards.${f.id}.desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CTA Footer */}
                <div className={styles.ctaSection}>
                    <h2>{t('publicPages.about.ctaTitle')}</h2>
                    <p>{t('publicPages.about.ctaSubtitle')}</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/register" className={styles.primaryCta}>{t('publicPages.about.ctaPrimary')}</Link>
                        <Link href="/help" className={styles.secondaryCta}>{t('publicPages.about.ctaSecondary')}</Link>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </>
    );
}

