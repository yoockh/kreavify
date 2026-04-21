'use client';
import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { getDashboardInsights } from '@/lib/ml-api';
import {
    formatCurrency, formatPercentage, formatMonthLabel,
    getTrendColor, getPricingStatusLabel, getPricingStatusColor,
    getExperienceLevelLabel, clamp
} from '@/lib/utils';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ReferenceLine
} from 'recharts';
import {
    Brain, TrendingUp, TrendingDown, Minus, Target, Award,
    AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import styles from './page.module.css';

export default function AIInsightsPage() {
    const { t } = useI18n();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadInsights = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const data = await getDashboardInsights();
            setInsights(data);
        } catch (err) {
            setError(err.message || 'Gagal memuat data AI');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadInsights();
    }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={() => loadInsights()} />;
    if (!insights) return null;

    const forecast = insights.revenue_forecast;
    const pricingInsights = insights.pricing_insights || [];
    const underpricedItems = pricingInsights.filter(p => p.analysis?.status === 'underprice');
    const fairItems = pricingInsights.filter(p => p.analysis?.status === 'fair');
    const overpricedItems = pricingInsights.filter(p => p.analysis?.status === 'overprice');

    const trendColor = getTrendColor(forecast?.insights?.trend);
    const TrendIcon = forecast?.insights?.trend === 'naik'
        ? TrendingUp
        : forecast?.insights?.trend === 'turun'
            ? TrendingDown : Minus;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <Brain size={22} />
                    </div>
                    <div>
                        <h1 className={styles.title}>{t('aiInsightsPage.title')}</h1>
                        <p className={styles.subtitle}>{t('aiInsightsPage.subtitle')}</p>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            {t('aiInsightsPage.disclaimer')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => loadInsights(true)}
                    disabled={refreshing}
                    className={styles.refreshBtn}
                    aria-label="Refresh data"
                >
                    <RefreshCw size={16} className={refreshing ? styles.spin : ''} />
                    {refreshing ? t('aiInsightsPage.loadingBtn') : t('aiInsightsPage.loadBtn')}
                </button>
            </div>

            {/* ── Revenue Forecast Section ── */}
            {forecast ? (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('aiInsightsPage.forecastSectionTitle')}</h2>
                    <div className={styles.forecastGrid}>
                        {/* Main Forecast Card */}
                        <div className={styles.forecastCard}>
                            <div className={styles.forecastHeader}>
                                <span className={styles.forecastLabel}>
                                    {t('aiInsightsPage.forecastPreLabel')} {formatMonthLabel(forecast.forecast_month)}
                                </span>
                                <TrendIcon size={20} style={{ color: trendColor }} />
                            </div>
                            <div className={styles.forecastAmount}>
                                {formatCurrency(forecast.predicted_amount)}
                            </div>
                            <div className={styles.forecastTrend} style={{ color: trendColor }}>
                                <TrendIcon size={14} />
                                <span>
                                    {forecast.insights?.trend === 'naik' ? t('aiInsightsPage.trendUpDesc') :
                                        forecast.insights?.trend === 'turun' ? t('aiInsightsPage.trendDownDesc') : t('aiInsightsPage.trendStableDesc')}
                                    &nbsp;{Math.abs(forecast.insights?.change_percentage ?? 0).toFixed(1)}% {t('aiInsightsPage.fromLastMonth')}
                                </span>
                            </div>

                            <div className={styles.confidenceSection}>
                                <div className={styles.confidenceRow}>
                                    <span>{t('aiInsightsPage.confidenceLevel')}</span>
                                    <strong>{Math.round(forecast.confidence_score * 100)}%</strong>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${clamp(forecast.confidence_score * 100, 0, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className={styles.rangeRow}>
                                <div className={styles.rangeItem}>
                                    <span className={styles.rangeLabel}>{t('aiInsightsPage.lowerBound')}</span>
                                    <span className={styles.rangeValue}>{formatCurrency(forecast.lower_bound)}</span>
                                </div>
                                <div className={styles.rangeItem}>
                                    <span className={styles.rangeLabel}>{t('aiInsightsPage.upperBound')}</span>
                                    <span className={styles.rangeValue}>{formatCurrency(forecast.upper_bound)}</span>
                                </div>
                                <div className={styles.rangeItem}>
                                    <span className={styles.rangeLabel}>{t('aiInsightsPage.avgProjects')}</span>
                                    <span className={styles.rangeValue}>{forecast.insights?.avg_projects_per_month ?? '-'}/bln</span>
                                </div>
                            </div>

                            <div className={styles.insightMessage}>
                                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                                <p>{forecast.insights?.message}</p>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', fontStyle: 'italic' }}>
                                {t('aiInsightsPage.forecastDisclaimer')}
                            </p>
                        </div>

                        {/* Experience Level Card */}
                        <div className={styles.expCard}>
                            <Award size={32} className={styles.expIcon} />
                            <div className={styles.expLevel}>
                                {getExperienceLevelLabel(insights.experience_level || 'junior')}
                            </div>
                            <div className={styles.expLabel}>{t('aiInsightsPage.expLevel')}</div>
                            <p className={styles.expNote}>
                                {t('aiInsightsPage.expNote')}
                            </p>
                        </div>
                    </div>
                </section>
            ) : (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('aiInsightsPage.forecastSectionTitle')}</h2>
                    <EmptyState
                        message={t('aiInsightsPage.notEnoughDataTitle')}
                        detail={t('aiInsightsPage.notEnoughDataDesc')}
                    />
                </section>
            )}

            {/* ── Pricing Analysis Section ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeaderRow}>
                    <h2 className={styles.sectionTitle}>{t('aiInsightsPage.pricingSectionTitle')}</h2>
                    {insights.total_potential_increase > 0 && (
                        <div className={styles.potentialBadge}>
                            {t('aiInsightsPage.potentialIncreaseBadge')}: <strong>{formatCurrency(insights.total_potential_increase)}/bln</strong>
                        </div>
                    )}
                </div>

                {pricingInsights.length === 0 ? (
                    <EmptyState
                        message={t('aiInsightsPage.noServiceTitle')}
                        detail={t('aiInsightsPage.noServiceDesc')}
                    />
                ) : (
                    <>
                        {/* Summary Pills */}
                        <div className={styles.summaryPills}>
                            <div className={`${styles.pill} ${styles.pillDanger}`}>
                                <ArrowDownRight size={14} />
                                {underpricedItems.length} {t('aiInsightsPage.pillUnder')}
                            </div>
                            <div className={`${styles.pill} ${styles.pillSuccess}`}>
                                <CheckCircle size={14} />
                                {fairItems.length} {t('aiInsightsPage.pillFair')}
                            </div>
                            <div className={`${styles.pill} ${styles.pillWarning}`}>
                                <ArrowUpRight size={14} />
                                {overpricedItems.length} {t('aiInsightsPage.pillOver')}
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className={styles.pricingGrid}>
                            {pricingInsights.map((item) => {
                                const analysis = item.analysis;
                                if (!analysis) return null;
                                const statusColor = getPricingStatusColor(analysis.status);
                                const statusLabel = getPricingStatusLabel(analysis.status);
                                const isUnder = analysis.status === 'underprice';

                                return (
                                    <div key={item.service_id} className={styles.pricingCard}>
                                        <div className={styles.pricingCardHeader}>
                                            <div>
                                                <div className={styles.serviceName}>{item.service_title}</div>
                                                <div className={styles.serviceCategory}>{item.category}</div>
                                            </div>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ background: statusColor + '20', color: statusColor }}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>

                                        <div className={styles.priceComparison}>
                                            <div className={styles.priceCol}>
                                                <span className={styles.priceColLabel}>{t('aiInsightsPage.yourPrice')}</span>
                                                <span className={styles.priceColValue}>
                                                    {formatCurrency(analysis.user_price)}
                                                </span>
                                            </div>
                                            <div className={styles.priceColDivider}>{t('aiInsightsPage.vs')}</div>
                                            <div className={styles.priceCol}>
                                                <span className={styles.priceColLabel}>{t('aiInsightsPage.marketOptimal')}</span>
                                                <span className={styles.priceColValue} style={{ color: '#2563eb' }}>
                                                    {formatCurrency(analysis.market_optimal)}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={styles.differenceTag}
                                            style={{ background: statusColor + '15', color: statusColor }}
                                        >
                                            {isUnder ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                                            {formatCurrency(Math.abs(analysis.difference))} ({Math.abs(analysis.difference_percentage).toFixed(1)}%)
                                        </div>

                                        <p className={styles.pricingMessage}>{analysis.message}</p>

                                        {analysis.market_range && (
                                            <div className={styles.marketRange}>
                                                <span>{t('aiInsightsPage.marketRange')}:</span>
                                                <span>{formatCurrency(analysis.market_range.min_price)} – {formatCurrency(analysis.market_range.max_price)}</span>
                                            </div>
                                        )}
                                        <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                            {t('aiInsightsPage.pricingDisclaimer')}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            {/* ── Action Items ── */}
            {(underpricedItems.length > 0 || forecast?.insights?.trend === 'turun') && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('aiInsightsPage.actionTitle')}</h2>
                    <div className={styles.actionGrid}>
                        {underpricedItems.length > 0 && (
                            <div className={styles.actionCard}>
                                <div className={styles.actionIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>
                                    <ArrowUpRight size={18} />
                                </div>
                                <div>
                                    <h4 className={styles.actionTitle}>{t('aiInsightsPage.actionUpPrice')}</h4>
                                    <p className={styles.actionDesc}>
                                        {underpricedItems.length} jasa kamu berada di bawah harga pasar.
                                        Pertimbangkan untuk menaikkan harga agar lebih kompetitif dan menguntungkan.
                                    </p>
                                </div>
                            </div>
                        )}
                        {forecast?.insights?.trend === 'turun' && (
                            <div className={styles.actionCard}>
                                <div className={styles.actionIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                                    <Target size={18} />
                                </div>
                                <div>
                                    <h4 className={styles.actionTitle}>{t('aiInsightsPage.actionFindClients')}</h4>
                                    <p className={styles.actionDesc}>
                                        Tren pendapatan menunjukkan penurunan. Pertimbangkan untuk memperluas jaringan,
                                        mengaktifkan profil publik, atau menawarkan promo terbatas.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

// ── Sub-components ──

function LoadingSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className={styles.skeletonBox} style={{ width: 42, height: 42, borderRadius: '0.5rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div className={styles.skeletonBox} style={{ width: 220, height: 22 }} />
                        <div className={styles.skeletonBox} style={{ width: 300, height: 14 }} />
                    </div>
                </div>
            </div>
            {[1, 2].map(i => (
                <section key={i} className={styles.section}>
                    <div className={styles.skeletonBox} style={{ width: 200, height: 18, marginBottom: '1rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[1, 2].map(j => (
                            <div key={j} className={styles.forecastCard}>
                                <div className={styles.skeletonBox} style={{ width: '60%', height: 14 }} />
                                <div className={styles.skeletonBox} style={{ width: '80%', height: 32, marginTop: '0.5rem' }} />
                                <div className={styles.skeletonBox} style={{ width: '40%', height: 14, marginTop: '0.5rem' }} />
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className={styles.container}>
            <div className={styles.errorState}>
                <AlertCircle size={32} style={{ color: '#ef4444' }} />
                <h3>{t('aiInsightsPage.failLoad')}</h3>
                <p>{message}</p>
                <button onClick={onRetry} className={styles.retryBtn}>{t('aiInsightsPage.retry')}</button>
            </div>
        </div>
    );
}

function EmptyState({ message, detail }) {
    return (
        <div className={styles.emptyState}>
            <Brain size={36} style={{ color: '#d1d5db' }} />
            <p className={styles.emptyMain}>{message}</p>
            {detail && <p className={styles.emptyDetail}>{detail}</p>}
        </div>
    );
}
