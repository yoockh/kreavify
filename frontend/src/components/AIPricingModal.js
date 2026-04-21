'use client';
import { useI18n } from '@/lib/i18n';
import { useState } from 'react';
import { getAIPricing } from '@/lib/api';
import { Brain, X, Check } from 'lucide-react';
import styles from './aiPricingModal.module.css';

export default function AIPricingModal({ isOpen, onClose, initialDescription, onApplyPrice }) {
    const { t, locale } = useI18n();
    const [description, setDescription] = useState(initialDescription || '');
    const [targetMarket, setTargetMarket] = useState('UMKM Indonesia');
    const [complexity, setComplexity] = useState('menengah');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCheck = async () => {
        if (!description.trim()) {
            setError(t('aiPricingModal.errEmpty'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await getAIPricing({
                service_description: description,
                target_market: targetMarket,
                complexity: complexity,
                language: locale
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                const err = await res.json();
                // Dalam mode hackathon, tidak ada pembatasan kuota AI
                setError(err.detail || t('aiPricingModal.errFail'));
            }
        } catch (e) {
            setError(t('aiPricingModal.errConn'));
        } finally {
            setLoading(false);
        }
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <Brain className={styles.icon} size={24} />
                        <h2 className={styles.title}>{t('aiPricingModal.title')}</h2>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label>{t('aiPricingModal.descLabel')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('aiPricingModal.descPh')}
                            rows="3"
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>{t('aiPricingModal.targetMarket')}</label>
                            <select value={targetMarket} onChange={e => setTargetMarket(e.target.value)}>
                                <option value="Event Pribadi / Personal">{t('aiPricingModal.marketPersonal')}</option>
                                <option value="UMKM Indonesia">{t('aiPricingModal.marketSME')}</option>
                                <option value="Startup">{t('aiPricingModal.marketStartup')}</option>
                                <option value="Korporat Menengah">{t('aiPricingModal.marketMidCorp')}</option>
                                <option value="Korporat Besar / Multinasional">{t('aiPricingModal.marketBigCorp')}</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('aiPricingModal.complexity')}</label>
                            <select value={complexity} onChange={e => setComplexity(e.target.value)}>
                                <option value="sangat_sederhana">{t('aiPricingModal.compVerySimple')}</option>
                                <option value="sederhana">{t('aiPricingModal.compSimple')}</option>
                                <option value="menengah">{t('aiPricingModal.compMedium')}</option>
                                <option value="kompleks">{t('aiPricingModal.compComplex')}</option>
                                <option value="sangat_kompleks">{t('aiPricingModal.compVeryComplex')}</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className={styles.checkBtn}
                    >
                        {loading ? t('aiPricingModal.calculating') : t('aiPricingModal.checkFairPrice')}
                    </button>

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    {result && (
                        <div className={styles.resultContainer}>
                            <div className={styles.priceRange}>
                                <div>
                                    <div className={styles.priceLabel}>{t('aiPricingModal.estMarketPrice')}</div>
                                    <div className={styles.priceValue}>
                                        {formatRp(result.suggested_min)} - {formatRp(result.suggested_max)}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.explanation}>
                                <p>{result.explanation}</p>
                            </div>

                            <div className={styles.factors}>
                                <strong>{t('aiPricingModal.detFactors')}</strong>
                                <ul>
                                    {result.factors?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>

                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => onApplyPrice(result.suggested_min)}
                                    className={styles.applyBtnOutline}
                                >
                                    {t('aiPricingModal.useMinPrice')}
                                </button>
                                <button
                                    onClick={() => onApplyPrice(result.suggested_max)}
                                    className={styles.applyBtnFill}
                                >
                                    <Check size={16} /> {t('aiPricingModal.useMaxPrice')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
