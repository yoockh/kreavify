'use client';
import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Banknote, Clock, CheckCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './page.module.css';

export default function DashboardHome() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;
    if (!data) return <div className="p-8 text-danger">Gagal memuat data</div>;

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
                                        <td className="font-semibold">{formatRp(inv.total)}</td>
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
            </div>
        </div>
    );
}
