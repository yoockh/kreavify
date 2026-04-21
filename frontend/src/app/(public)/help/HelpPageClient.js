'use client';

import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import styles from './page.module.css';
import { Rocket, FileText, Image, ScrollText, Bot, BarChart2, MessageCircle } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '@/lib/i18n';

const sections = [
    { id: 'gettingStarted', Icon: Rocket, itemIds: ['whatIs', 'createAccount', 'isFree'] },
    { id: 'invoicePayments', Icon: FileText, itemIds: ['createInvoice', 'clientNeedsAccount', 'sendReminder', 'invoiceNumber'] },
    { id: 'profilePortfolio', Icon: Image, itemIds: ['publicProfile', 'addPortfolio', 'bannerNotSaved'] },
    { id: 'digitalContract', Icon: ScrollText, itemIds: ['generateContract', 'legalPower'] },
    { id: 'ai', Icon: Bot, itemIds: ['revenueForecast', 'accuracy', 'pricing', 'dataSource', 'mustFollow'] },
    { id: 'tax', Icon: BarChart2, itemIds: ['taxEstimate', 'taxAccuracy'] },
];

export default function HelpPageClient() {
    const { t } = useI18n();

    return (
        <>
            <PublicNavbar />
            <div className={styles.pageWrapper}>
                <div className={styles.hero}>
                    <div className={styles.heroInner}>
                        <div className={styles.heroLottie}>
                            <DotLottieReact
                                src="/help.lottie"
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>{t('publicPages.help.title')}</h1>
                            <p className={styles.heroSubtitle}>{t('publicPages.help.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className={styles.content}>
                    {sections.map((section) => (
                        <section key={section.id} className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>
                                    <section.Icon size={18} />
                                </span>
                                {t(`publicPages.help.sections.${section.id}`)}
                            </h2>
                            <div className={styles.faqList}>
                                {section.itemIds.map((itemId) => (
                                    <div key={itemId} className={styles.faqItem}>
                                        <h3 className={styles.question}>{t(`publicPages.help.faq.${section.id}.${itemId}.q`)}</h3>
                                        <p className={styles.answer}>{t(`publicPages.help.faq.${section.id}.${itemId}.a`)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className={styles.contactCta}>
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaIconWrap}>
                            <MessageCircle size={28} />
                        </div>
                        <h2>{t('publicPages.help.ctaTitle')}</h2>
                        <p>{t('publicPages.help.ctaSubtitle')}</p>
                        <a href="/contact" className={styles.ctaBtn}>{t('publicPages.help.ctaButton')}</a>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </>
    );
}

