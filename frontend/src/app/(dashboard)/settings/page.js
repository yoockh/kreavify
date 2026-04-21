'use client';
import { useEffect, useState } from 'react';
import { Globe, MapPin, Search, Send, FileText, HelpCircle, Info, Mail } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
    const { locale, setLocale, t } = useI18n();
    const [localization, setLocalization] = useState({
        language: 'id',
        country: 'Indonesia',
        address: ''
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setLocalization((prev) => ({ ...prev, language: locale }));
    }, [locale]);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('settings.title')}</h1>
                <p className={styles.subtitle}>{t('settings.subtitle')}</p>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Localization */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        <Globe size={18} /> {t('settings.localizationTitle')}
                    </h2>
                    <p className={styles.cardSubtitle}>{t('settings.localizationSubtitle')}</p>

                    <div className={styles.formGroup}>
                        <label>{t('settings.uiLanguageLabel')}</label>
                        <select
                            value={localization.language}
                            onChange={e => {
                                const next = e.target.value;
                                setLocalization({ ...localization, language: next });
                                setLocale(next);
                            }}
                            className={styles.input}
                        >
                            <option value="id">{t('settings.uiLanguageId')}</option>
                            <option value="en">{t('settings.uiLanguageEn')}</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('settings.countryLabel')}</label>
                        <select
                            value={localization.country}
                            onChange={e => setLocalization({ ...localization, country: e.target.value })}
                            className={styles.input}
                        >
                            <option value="Indonesia">Indonesia</option>
                            <option value="Singapura">Singapura</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Amerika Serikat">Amerika Serikat</option>
                            <option value="Australia">Australia</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('settings.addressLabel')}</label>
                        <textarea
                            value={localization.address}
                            onChange={e => setLocalization({ ...localization, address: e.target.value })}
                            className={styles.input}
                            rows="3"
                            placeholder={t('settings.addressPlaceholder')}
                        />
                    </div>

                    <div className={styles.actions}>
                        {saved && <span className={styles.successText}>{t('settings.settingsSaved')}</span>}
                        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                            {saving ? t('common.actions.saving') : t('settings.saveSettings')}
                        </button>
                    </div>
                </div>

                {/* Right Column: Help & Support */}
                <div className={styles.sideCol}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <HelpCircle size={18} /> {t('settings.helpTitle')}
                        </h2>

                        <div className={styles.linkList}>
                            <Link href="/help" className={styles.linkItem}>
                                <FileText size={18} />
                                <div>
                                    <strong>{t('settings.helpCenterTitle')}</strong>
                                    <span>{t('settings.helpCenterDesc')}</span>
                                </div>
                            </Link>

                            <Link href="/contact" className={styles.linkItem}>
                                <Mail size={18} />
                                <div>
                                    <strong>{t('settings.contactTitle')}</strong>
                                    <span>{t('settings.contactDesc')}</span>
                                </div>
                            </Link>

                            <Link href="/about" className={styles.linkItem}>
                                <Info size={18} />
                                <div>
                                    <strong>{t('settings.aboutTitle')}</strong>
                                    <span>{t('settings.aboutDesc')}</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{t('settings.publicProfileTitle')}</h2>
                        <p className={styles.cardSubtitle}>{t('settings.publicProfileSubtitle')}</p>
                        <Link href="/profile" className={styles.secondaryBtn}>
                            {t('settings.editPublicProfile')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
