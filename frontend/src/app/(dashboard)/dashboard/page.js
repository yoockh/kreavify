'use client';
import { useEffect, useState } from 'react';
import { getDashboard, getAnalyticsStats } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { FileText, Banknote, Clock, CheckCircle, Eye, MousePointerClick } from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './page.module.css';

export default function DashboardHome() {
    const [data, setData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
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

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>;
    if (!data) return <div style={{ padding: '2rem', color: 'var(--danger)' }}>Gagal memuat data</div>;

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Overview</h1>
                <p className={styles.subtitle}>Ringkasan aktivitas dan pendapatan kamu</p>
            </div>

            <div className={styles.grid}>
                <StatCard
                    title="Total Pendapatan"
                    value={formatRp(data.total_revenue)}
                    icon={Banknote}
                    color="#10B981"
                />
                <StatCard
                    title="Menunggu Pembayaran"
                    value={formatRp(data.pending_amount)}
                    icon={Clock}
                    color="#F59E0B"
                />
                <StatCard
                    title="Total Invoice"
                    value={data.total_invoices}
                    icon={FileText}
                    color="#3B82F6"
                />
                <StatCard
                    title="Invoice Dibayar"
                    value={data.paid_count}
                    icon={CheckCircle}
                    color="#10B981"
                />
                {analytics && (
                    <>
                        <StatCard
                            title="Profile Views"
                            value={analytics.total_views}
                            icon={Eye}
                            color="#8B5CF6"
                        />
                        <StatCard
                            title="Service Clicks"
                            value={analytics.total_clicks}
                            icon={MousePointerClick}
                            color="#EC4899"
                        />
                    </>
                )}
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Pendapatan 6 Bulan Terakhir</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthly_revenue || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis dataKey="amount" axisLine={false} tickLine={false} tickFormatter={(val) => `Rp ${val / 1000}k`} />
                                <Tooltip formatter={(value) => formatRp(value)} />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {analytics && analytics.daily_views_chart?.length > 0 ? (
                    <div className={styles.chartCard}>
                        <h3 className={styles.cardTitle}>Profile Views — 7 Hari Terakhir</h3>
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
                        <h3 className={styles.cardTitle}>Invoice Terbaru</h3>
                        <div className={styles.tableResponsive}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Klien</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_invoices?.map(inv => (
                                        <tr key={inv.id}>
                                            <td className={styles.invoiceNo}>{inv.invoice_number || 'Draft'}</td>
                                            <td>{inv.client_name}</td>
                                            <td style={{ fontWeight: 600 }}>{formatRp(inv.total)}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles['badge-' + inv.status]}`}>
                                                    {inv.status === 'draft' ? 'Draft' :
                                                        inv.status === 'sent' ? 'Menunggu' :
                                                            inv.status === 'paid' ? 'Dibayar' : 'Dibatalkan'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.recent_invoices || data.recent_invoices.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className={styles.emptyState}>Belum ada invoice</td>
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
