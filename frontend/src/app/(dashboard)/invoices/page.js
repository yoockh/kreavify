'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInvoices, deleteInvoice, sendInvoice, cancelInvoice } from '@/lib/api';
import { FileText, Plus, Search, MoreVertical, Copy, Trash2, Send, XCircle } from 'lucide-react';
import styles from './page.module.css';

export default function InvoicesList() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(''); // '', 'draft', 'sent', 'paid', 'cancelled'
    const [search, setSearch] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    const fetchInvoices = async () => {
        try {
            let query = '?';
            if (filter) query += `status=${filter}&`;
            if (search) query += `search=${search}`;

            const res = await getInvoices(query);
            const data = await res.json();
            setInvoices(data.results || data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchInvoices();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filter, search]);

    const toggleMenu = (id) => {
        if (activeMenu === id) setActiveMenu(null);
        else setActiveMenu(id);
    };

    const handleAction = async (action, id) => {
        setActiveMenu(null);
        try {
            if (action === 'delete') {
                if (confirm('Hapus draft ini?')) await deleteInvoice(id);
            } else if (action === 'send') {
                if (confirm('Kirim invoice ke klien?')) {
                    const res = await sendInvoice(id);
                    if (res.ok) {
                        const data = await res.json();
                        alert(`Link pembayaran: ${data.payment_url}`);
                    }
                }
            } else if (action === 'cancel') {
                if (confirm('Batalkan invoice ini?')) await cancelInvoice(id);
            } else if (action === 'copyUrl') {
                // Find slug
                const inv = invoices.find(i => i.id === id);
                if (inv) {
                    const url = `${window.location.origin}/pay/${inv.slug}`;
                    navigator.clipboard.writeText(url);
                    alert('Link pembayaran disalin!');
                }
            }
            fetchInvoices();
        } catch (e) {
            alert('Terjadi kesalahan');
        }
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invoice Saya</h1>
                    <p className={styles.subtitle}>Kelola semua tagihan ke klien</p>
                </div>
                <Link href="/invoices/new" className={styles.addBtn}>
                    <Plus size={20} /> Buat Invoice Baru
                </Link>
            </div>

            <div className={styles.filtersWrapper}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${filter === '' ? styles.activeTab : ''}`} onClick={() => setFilter('')}>Semua</button>
                    <button className={`${styles.tab} ${filter === 'draft' ? styles.activeTab : ''}`} onClick={() => setFilter('draft')}>Draft</button>
                    <button className={`${styles.tab} ${filter === 'sent' ? styles.activeTab : ''}`} onClick={() => setFilter('sent')}>Terkirim</button>
                    <button className={`${styles.tab} ${filter === 'paid' ? styles.activeTab : ''}`} onClick={() => setFilter('paid')}>Dibayar</button>
                    <button className={`${styles.tab} ${filter === 'cancelled' ? styles.activeTab : ''}`} onClick={() => setFilter('cancelled')}>Dibatalkan</button>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Cari nama klien..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No. Invoice</th>
                                <th>Klien</th>
                                <th>Total Tagihan</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Memuat...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>
                                        <FileText size={40} className={styles.emptyIcon} />
                                        <p>Tidak ada invoice ditemukan.</p>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="font-medium text-blue-600">{inv.invoice_number || 'Draft'}</td>
                                        <td>{inv.client_name}</td>
                                        <td className="font-semibold">{formatRp(inv.total)}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles['badge-' + inv.status]}`}>
                                                {inv.status === 'draft' ? 'Draft' :
                                                    inv.status === 'sent' ? 'Menunggu' :
                                                        inv.status === 'paid' ? 'Dibayar' : 'Dibatalkan'}
                                            </span>
                                        </td>
                                        <td className="text-muted text-sm">{new Date(inv.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className={styles.actionCell}>
                                            <div className={styles.menuContainer}>
                                                <button onClick={() => toggleMenu(inv.id)} className={styles.menuBtn}>
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenu === inv.id && (
                                                    <div className={styles.dropdown}>
                                                        <Link href={`/invoices/${inv.id}`} className={styles.dropdownItem}>
                                                            Lihat Detail
                                                        </Link>

                                                        {inv.status === 'draft' && (
                                                            <>
                                                                <button onClick={() => handleAction('send', inv.id)} className={styles.dropdownItem}>
                                                                    <Send size={16} /> Kirim ke Klien
                                                                </button>
                                                                <button onClick={() => handleAction('delete', inv.id)} className={`${styles.dropdownItem} text-red-600`}>
                                                                    <Trash2 size={16} /> Hapus
                                                                </button>
                                                            </>
                                                        )}

                                                        {inv.status === 'sent' && (
                                                            <>
                                                                <button onClick={() => handleAction('copyUrl', inv.id)} className={styles.dropdownItem}>
                                                                    <Copy size={16} /> Salin Link Bayar
                                                                </button>
                                                                <button onClick={() => handleAction('cancel', inv.id)} className={`${styles.dropdownItem} text-red-600`}>
                                                                    <XCircle size={16} /> Batalkan
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
