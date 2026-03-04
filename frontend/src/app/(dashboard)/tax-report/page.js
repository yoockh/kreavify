'use client';
import { useState, useEffect } from 'react';
import { getTaxReport } from '@/lib/api';
import { Calculator, Download, TrendingUp, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function TaxReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await getTaxReport(year);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReport();
    }, [year]);

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat laporan pajak...</div>;
    if (!data) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Gagal memuat data</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Laporan Pajak</h1>
                    <p className={styles.subtitle}>Rekap penghasilan tahunan untuk pelaporan SPT</p>
                </div>
                <div className={styles.headerActions}>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className={styles.yearSelect}
                    >
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <button onClick={() => window.print()} className={styles.downloadBtn}>
                        <Download size={16} /> Cetak / PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className={styles.summaryLabel}>Total Pendapatan {year}</p>
                        <h2 className={styles.summaryValue}>{formatRp(data.annual_total)}</h2>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <Calculator size={24} />
                    </div>
                    <div>
                        <p className={styles.summaryLabel}>Estimasi PPh Final {data.pph_final_rate}</p>
                        <h2 className={styles.summaryValue}>{formatRp(data.pph_final_estimate)}</h2>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className={styles.summaryLabel}>Total Invoice Dibayar</p>
                        <h2 className={styles.summaryValue}>{data.total_invoices_paid}</h2>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className={styles.infoBanner}>
                <AlertCircle size={18} />
                <span>{data.note}</span>
            </div>

            {/* Monthly Breakdown Table */}
            <div className={styles.tableCard}>
                <h3 className={styles.cardTitle}>Rincian Pendapatan Bulanan — {year}</h3>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Bulan</th>
                                <th style={{ textAlign: 'center' }}>Jumlah Invoice</th>
                                <th style={{ textAlign: 'right' }}>Pendapatan</th>
                                <th style={{ textAlign: 'right' }}>PPh 0.5%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.months.map((m) => (
                                <tr key={m.month} className={m.total_income > 0 ? styles.activeRow : ''}>
                                    <td>{m.month_name}</td>
                                    <td style={{ textAlign: 'center' }}>{m.invoice_count}</td>
                                    <td style={{ textAlign: 'right' }}>{formatRp(m.total_income)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatRp(Math.round(m.total_income * 0.005))}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.totalRow}>
                                <td><strong>TOTAL</strong></td>
                                <td style={{ textAlign: 'center' }}><strong>{data.total_invoices_paid}</strong></td>
                                <td style={{ textAlign: 'right' }}><strong>{formatRp(data.annual_total)}</strong></td>
                                <td style={{ textAlign: 'right' }}><strong>{formatRp(data.pph_final_estimate)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
