'use client';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from './page.module.css';
import { useI18n } from '@/lib/i18n';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const { t } = useI18n();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/mjgenpob", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                setSubmitted(true);
                form.reset();
            } else {
                alert(t('publicPages.contact.form.sendingFailed'));
            }
        } catch (error) {
            alert(t('publicPages.contact.form.error'));
        }
    };

    return (
        <div className={styles.contactRoot} style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <PublicNavbar />

            <div className={styles.contactWrapper}>
                <div className={styles.contactContainer}>
                    {/* Left: Lottie */}
                    <div className={styles.contactLottie}>
                        <DotLottieReact
                            src="/contact_us.lottie"
                            loop
                            autoplay
                            style={{ width: '100%', height: 450 }}
                        />
                    </div>

                    {/* Right: Form */}
                    <div className={styles.contactFormCol}>
                        <div className={styles.contactCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.mailIcon}><Mail size={28} /></div>
                                <h1 className={styles.cardTitle}>{t('publicPages.contact.title')}</h1>
                                <p className={styles.cardSubtitle}>{t('publicPages.contact.subtitle')}</p>
                            </div>

                            {submitted ? (
                                <div className={styles.successState}>
                                    <CheckCircle size={56} color="#10b981" />
                                    <h2>{t('publicPages.contact.successTitle')}</h2>
                                    <p>{t('publicPages.contact.successText')}</p>
                                    <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>{t('publicPages.contact.successReset')}</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label>{t('publicPages.contact.form.name')}</label>
                                        <input name="name" type="text" required placeholder={t('publicPages.contact.form.namePlaceholder')} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('publicPages.contact.form.email')}</label>
                                        <input name="email" type="email" required placeholder={t('publicPages.contact.form.emailPlaceholder')} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('publicPages.contact.form.subject')}</label>
                                        <select name="subject">
                                            <option value={t('publicPages.contact.form.subjects.general')}>{t('publicPages.contact.form.subjects.general')}</option>
                                            <option value={t('publicPages.contact.form.subjects.bug')}>{t('publicPages.contact.form.subjects.bug')}</option>
                                            <option value={t('publicPages.contact.form.subjects.feature')}>{t('publicPages.contact.form.subjects.feature')}</option>
                                            <option value={t('publicPages.contact.form.subjects.business')}>{t('publicPages.contact.form.subjects.business')}</option>
                                            <option value={t('publicPages.contact.form.subjects.other')}>{t('publicPages.contact.form.subjects.other')}</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('publicPages.contact.form.message')}</label>
                                        <textarea name="message" required rows="5" placeholder={t('publicPages.contact.form.messagePlaceholder')} />
                                    </div>
                                    <button type="submit" className={styles.submitBtn}>
                                        <Send size={16} /> {t('publicPages.contact.form.send')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
}
