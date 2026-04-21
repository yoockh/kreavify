'use client';
import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { getDashboard, getAnalyticsStats } from '@/lib/api';
import { getDashboardInsights } from '@/lib/ml-api';
import { formatCurrency, formatPercentage, formatMonthLabel, getTrendColor, getPricingStatusLabel, getPricingStatusColor, getExperienceLevelLabel, clamp } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Area, AreaChart, ReferenceLine
} from 'recharts';
import {
    FileText, Banknote, Clock, CheckCircle, Eye, MousePointerClick,
    TrendingUp, TrendingDown, Minus, Brain, AlertCircle, ChevronRight,
    Target, Award, Loader2
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import styles from './page.module.css';

export default function DashboardHome() {
    const { t } = useI18n();
    const [data, setData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [mlInsights, setMlInsights] = useState(null);
    const [mlLoading, setMlLoading] = useState(true);
    const [mlError, setMlError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getDashboard().then(res => res.json()),
            getAnalyticsStats().then(res => res.ok ? res.json() : null).catch(() => null)
        ]).then(([dashData, analyticsData]) => {
            setData(dashData);
            setAnalytics(analyticsData);
            setLoading(false);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        getDashboardInsights()
            .then(data => setMlInsights(data))
            .catch(err => setMlError(err.message))
            .finally(() => setMlLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>{t('dashboard.loading')}</div>;
    if (!data) return <div style={{ padding: '2rem', color: 'var(--danger)' }}>{t('dashboard.errorLoading')}</div>;

    const forecast = mlInsights?.revenue_forecast;
    const pricingInsights = mlInsights?.pricing_insights || [];
    const underpricedCount = pricingInsights.filter(p => p.analysis?.status === 'underprice').length;

    // Build chart data: historical (monthly_revenue) + forecast next month
    const buildChartData = () => {
        const historical = (data.monthly_revenue || []).map(m => ({
            label: m.month,
            actual: m.amount,
            forecast: null,
        }));
        if (forecast) {
            historical.push({
                label: formatMonthLabel(forecast.forecast_month),
                actual: null,
                forecast: forecast.predicted_amount,
                lower: forecast.lower_bound,
                upper: forecast.upper_bound,
            });
        }
        return historical;
    };

    const chartData = buildChartData();

    const TrendIcon = forecast?.insights?.trend === 'naik'
        ? TrendingUp
        : forecast?.insights?.trend === 'turun'
            ? TrendingDown
            : Minus;

    const trendColor = getTrendColor(forecast?.insights?.trend);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('dashboard.title')}</h1>
                <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
            </div>

            {/* ── AI Intelligence Section ── */}
            <div className={styles.aiSection}>
                <div className={styles.aiSectionHeader}>
                    <Brain size={20} className={styles.aiSectionIcon} />
                    <div>
                        <h2 className={styles.aiSectionTitle}>{t('dashboard.aiTitle')}</h2>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>
                            Prediksi berbasis analisis pola historis. Confidence score menunjukkan tingkat akurasi.
                        </p>
                    </div>
                    <Link href="/ai-insights" className={styles.aiSectionLink}>
                        {t('dashboard.seeAll')} <ChevronRight size={16} />
                    </Link>
                </div>

                <div className={styles.aiGrid}>
                    {/* Revenue Forecast Card */}
                    <div className={styles.insightCard}>
                        <div className={styles.insightCardHeader}>
                            <span className={styles.insightCardLabel}>{t('dashboard.nextMonthForecast')}</span>
                            <TrendIcon size={18} style={{ color: trendColor, flexShrink: 0 }} />
                        </div>

                        {mlLoading ? (
                            <AISkeletonContent />
                        ) : mlError ? (
                            <AIErrorContent message={mlError} />
                        ) : !forecast ? (
                            <AIEmptyContent />
                        ) : (
                            <>
                                <div className={styles.insightAmount}>
                                    {formatCurrency(forecast.predicted_amount)}
                                </div>
                                <div className={styles.insightTrend} style={{ color: trendColor }}>
                                    <TrendIcon size={14} />
                                    <span>
                                        {forecast.insights?.trend === 'naik' ? t('dashboard.trendUp') : forecast.insights?.trend === 'turun' ? t('dashboard.trendDown') : t('dashboard.trendStable')}&nbsp;
                                        {Math.abs(forecast.insights?.change_percentage ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <div className={styles.confidenceRow}>
                                    <span className={styles.confidenceLabel}>{t('dashboard.confidence')}</span>
                                    <span className={styles.confidenceValue}>{Math.round(forecast.confidence_score * 100)}%</span>
                                </div>
                                <div className={styles.progressBarTrack}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${clamp(forecast.confidence_score * 100, 0, 100)}%` }}
                                    />
                                </div>
                                <p className={styles.insightMessage}>{forecast.insights?.message}</p>
                            </>
                        )}
                    </div>

                    {/* Pricing Analysis Card */}
                    <div className={styles.insightCard}>
                        <div className={styles.insightCardHeader}>
                            <span className={styles.insightCardLabel}>{t('dashboard.pricingAnalysis')}</span>
                            <Target size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        </div>

                        {mlLoading ? (
                            <AISkeletonContent />
                        ) : mlError ? (
                            <AIErrorContent message={mlError} />
                        ) : pricingInsights.length === 0 ? (
                            <AIEmptyContent message={t('dashboard.addServiceToAnalyze')} />
                        ) : (
                            <>
                                <div className={styles.insightAmount} style={{ color: underpricedCount > 0 ? '#ef4444' : '#10b981' }}>
                                    {underpricedCount} {t('dashboard.servicesCount')}
                                </div>
                                <div className={styles.insightSubtitle}>
                                    {underpricedCount > 0
                                        ? t('dashboard.underpriced')
                                        : t('dashboard.fairPriced')}
                                </div>
                                {mlInsights?.total_potential_increase > 0 && (
                                    <div className={styles.potentialIncrease}>
                                        {t('dashboard.potentialIncrease')}: <strong>{formatCurrency(mlInsights.total_potential_increase)}/bulan</strong>
                                    </div>
                                )}
                                <Link href="/ai-insights" className={styles.detailLink}>
                                    {t('dashboard.seeDetail')} <ChevronRight size={14} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Quick Stats Card */}
                    <div className={styles.insightCard}>
                        <div className={styles.insightCardHeader}>
                            <span className={styles.insightCardLabel}>{t('dashboard.freelancerProfile')}</span>
                            <Award size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
                        </div>

                        {mlLoading ? (
                            <AISkeletonContent />
                        ) : (
                            <>
                                <div className={styles.profileStatRow}>
                                    <span>{t('dashboard.experienceLevel')}</span>
                                    <strong>{getExperienceLevelLabel(mlInsights?.experience_level || 'junior')}</strong>
                                </div>
                                <div className={styles.profileStatRow}>
                                    <span>{t('dashboard.totalPaidInvoices')}</span>
                                    <strong>{data.paid_count || 0}</strong>
                                </div>
                                <div className={styles.profileStatRow}>
                                    <span>{t('dashboard.totalRevenue')}</span>
                                    <strong>{formatCurrency(data.total_revenue || 0)}</strong>
                                </div>
                                {forecast && forecast.insights && (
                                    <div className={styles.profileStatRow}>
                                        <span>{t('dashboard.avgProjectsPerMonth')}</span>
                                        <strong>{forecast.insights.avg_projects_per_month}</strong>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Standard Stats Grid ── */}
            <div className={styles.grid}>
                <StatCard
                    title={t('dashboard.totalRevenue')}
                    value={formatCurrency(data.total_revenue)}
                    icon={Banknote}
                    color="#10B981"
                />
                <StatCard
                    title={t('dashboard.pendingPayment')}
                    value={formatCurrency(data.pending_amount)}
                    icon={Clock}
                    color="#F59E0B"
                />
                <StatCard
                    title={t('dashboard.totalInvoice')}
                    value={data.total_invoices}
                    icon={FileText}
                    color="#3B82F6"
                />
                <StatCard
                    title={t('dashboard.paidInvoice')}
                    value={data.paid_count}
                    icon={CheckCircle}
                    color="#10B981"
                />
                {analytics && (
                    <>
                        <StatCard
                            title={t('dashboard.profileViews')}
                            value={analytics.total_views}
                            icon={Eye}
                            color="#8B5CF6"
                        />
                        <StatCard
                            title={t('dashboard.serviceClicks')}
                            value={analytics.total_clicks}
                            icon={MousePointerClick}
                            color="#EC4899"
                        />
                    </>
                )}
            </div>

            {/* ── Revenue Trend Chart ── */}
            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>
                        {t('dashboard.revenueTrend')} {forecast ? t('dashboard.andForecast') : t('dashboard.last6Months')}
                    </h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => val >= 1_000_000 ? `${(val / 1_000_000).toFixed(0)}jt` : `${(val / 1_000).toFixed(0)}rb`}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        value != null ? formatCurrency(value) : '-',
                                        name === 'actual' ? t('dashboard.actual') : name === 'forecast' ? t('dashboard.forecastAI') : name,
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#2563eb' }}
                                    connectNulls={false}
                                    name="actual"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="forecast"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="6 4"
                                    dot={{ r: 5, fill: '#10b981', strokeDasharray: '0' }}
                                    connectNulls={false}
                                    name="forecast"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {forecast && (
                        <div className={styles.chartLegend}>
                            <span className={styles.legendItem}>
                                <span className={styles.legendDotBlue} /> {t('dashboard.actual')}
                            </span>
                            <span className={styles.legendItem}>
                                <span className={styles.legendDotGreen} /> {t('dashboard.forecastAI')}
                            </span>
                            <span className={styles.legendItem} style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                {t('dashboard.range')}: {formatCurrency(forecast.lower_bound)} – {formatCurrency(forecast.upper_bound)}
                            </span>
                        </div>
                    )}
                </div>

                {analytics && analytics.daily_views_chart?.length > 0 ? (
                    <div className={styles.chartCard}>
                        <h3 className={styles.cardTitle}>{t('dashboard.profileViews7Days')}</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.daily_views_chart}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="views" stroke="#8B5CF6" fill="rgba(139, 92, 246, 0.1)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableCard}>
                        <h3 className={styles.cardTitle}>{t('dashboard.recentInvoices')}</h3>
                        <div className={styles.tableResponsive}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.no')}</th>
                                        <th>{t('dashboard.client')}</th>
                                        <th>{t('dashboard.total')}</th>
                                        <th>{t('dashboard.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_invoices?.map(inv => (
                                        <tr key={inv.id}>
                                            <td className={styles.invoiceNo}>{inv.invoice_number || 'Draft'}</td>
                                            <td>{inv.client_name}</td>
                                            <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles['badge-' + inv.status]}`}>
                                                    {inv.status === 'draft' ? t('dashboard.draft') :
                                                        inv.status === 'sent' ? t('dashboard.waiting') :
                                                            inv.status === 'paid' ? t('dashboard.paid') : t('dashboard.cancelled')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.recent_invoices || data.recent_invoices.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className={styles.emptyState}>{t('dashboard.noInvoicesYet')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Helper sub-components ──

function AISkeletonContent() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.skeletonLine} style={{ width: '60%', height: '2rem' }} />
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
            <div className={styles.skeletonLine} style={{ width: '80%' }} />
        </div>
    );
}

function AIErrorContent({ message }) {
    const { t } = useI18n();
    return (
        <div className={styles.aiError}>
            <AlertCircle size={16} />
            <span>{message?.includes('Minimal') ? message : t('dashboard.notEnoughData')}</span>
        </div>
    );
}

function AIEmptyContent({ message }) {
    const { t } = useI18n();
    return (
        <div className={styles.aiEmpty}>
            <p>{message || t('dashboard.notEnoughData')}</p>
        </div>
    );
}
