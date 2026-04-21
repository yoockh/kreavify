'use client';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInvoices, deleteInvoice, sendInvoice, cancelInvoice } from '@/lib/api';
import { FileText, Plus, Search, MoreVertical, Copy, Trash2, Send, XCircle } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function InvoicesList() {
    const { t } = useI18n();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', variant: 'danger', onConfirm: null });

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

    const showConfirm = (title, message, variant, onConfirm) => {
        setConfirmDialog({ open: true, title, message, variant, onConfirm });
    };

    const handleAction = async (action, id) => {
        setActiveMenu(null);
        try {
            if (action === 'delete') {
                showConfirm(t('invoicesPage.deleteDraftTitle'), t('invoicesPage.deleteDraftConfirm'), 'danger', async () => {
                    await deleteInvoice(id);
                    setConfirmDialog({ ...confirmDialog, open: false });
                    fetchInvoices();
                });
            } else if (action === 'send') {
                showConfirm(t('invoicesPage.sendTitle'), t('invoicesPage.sendConfirm'), 'warning', async () => {
                    const res = await sendInvoice(id);
                    setConfirmDialog({ ...confirmDialog, open: false });
                    if (res.ok) {
                        const data = await res.json();
                        navigator.clipboard.writeText(data.payment_url);
                        fetchInvoices();
                    }
                    fetchInvoices();
                });
            } else if (action === 'cancel') {
                showConfirm(t('invoicesPage.cancelTitle'), t('invoicesPage.cancelConfirm'), 'danger', async () => {
                    await cancelInvoice(id);
                    setConfirmDialog({ ...confirmDialog, open: false });
                    fetchInvoices();
                });
            } else if (action === 'copyUrl') {
                const inv = invoices.find(i => i.id === id);
                if (inv) {
                    const url = `${window.location.origin}/pay/${inv.slug}`;
                    navigator.clipboard.writeText(url);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('invoicesPage.title')}</h1>
                    <p className={styles.subtitle}>{t('invoicesPage.subtitle')}</p>
                </div>
                <Link href="/invoices/new" className={styles.addBtn}>
                    <Plus size={20} /> {t('invoicesPage.newInvoice')}
                </Link>
            </div>

            <div className={styles.filtersWrapper}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${filter === '' ? styles.activeTab : ''}`} onClick={() => setFilter('')}>{t('invoicesPage.filterAll')}</button>
                    <button className={`${styles.tab} ${filter === 'draft' ? styles.activeTab : ''}`} onClick={() => setFilter('draft')}>{t('invoicesPage.filterDraft')}</button>
                    <button className={`${styles.tab} ${filter === 'sent' ? styles.activeTab : ''}`} onClick={() => setFilter('sent')}>{t('invoicesPage.filterSent')}</button>
                    <button className={`${styles.tab} ${filter === 'paid' ? styles.activeTab : ''}`} onClick={() => setFilter('paid')}>{t('invoicesPage.filterPaid')}</button>
                    <button className={`${styles.tab} ${filter === 'cancelled' ? styles.activeTab : ''}`} onClick={() => setFilter('cancelled')}>{t('invoicesPage.filterCancelled')}</button>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t('invoicesPage.searchPh')}
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
                                <th>{t('invoicesPage.invoiceNo')}</th>
                                <th>{t('invoicesPage.client')}</th>
                                <th>{t('invoicesPage.totalAmount')}</th>
                                <th>{t('invoicesPage.status')}</th>
                                <th>{t('invoicesPage.date')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>Memuat...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>
                                        <FileText size={40} className={styles.emptyIcon} />
                                        <p>{t('invoicesPage.noInvoiceFound')}</p>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{inv.invoice_number || 'Draft'}</td>
                                        <td>{inv.client_name}</td>
                                        <td style={{ fontWeight: 600 }}>{formatRp(inv.total)}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles['badge-' + inv.status]}`}>
                                                {inv.status === 'draft' ? t('dashboard.draft') :
                                                    inv.status === 'sent' ? t('dashboard.waiting') :
                                                        inv.status === 'paid' ? t('dashboard.paid') : t('dashboard.cancelled')}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(inv.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className={styles.actionCell}>
                                            <div className={styles.menuContainer}>
                                                <button onClick={() => toggleMenu(inv.id)} className={styles.menuBtn}>
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenu === inv.id && (
                                                    <div className={styles.dropdown}>
                                                        <Link href={`/invoices/${inv.id}`} className={styles.dropdownItem}>
                                                            {t('invoicesPage.seeDetail')}
                                                        </Link>

                                                        {inv.status === 'draft' && (
                                                            <>
                                                                <button onClick={() => handleAction('send', inv.id)} className={styles.dropdownItem}>
                                                                    <Send size={16} /> {t('invoicesPage.sendToClient')}
                                                                </button>
                                                                <button onClick={() => handleAction('delete', inv.id)} className={`${styles.dropdownItem} ${styles.dropdownDanger}`}>
                                                                    <Trash2 size={16} /> {t('invoicesPage.delete')}
                                                                </button>
                                                            </>
                                                        )}

                                                        {inv.status === 'sent' && (
                                                            <>
                                                                <button onClick={() => handleAction('copyUrl', inv.id)} className={styles.dropdownItem}>
                                                                    <Copy size={16} /> {t('invoicesPage.copyPayLink')}
                                                                </button>
                                                                <button onClick={() => handleAction('cancel', inv.id)} className={`${styles.dropdownItem} ${styles.dropdownDanger}`}>
                                                                    <XCircle size={16} /> {t('invoicesPage.cancelInvoiceBtn')}
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

            <ConfirmDialog
                isOpen={confirmDialog.open}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
            />
        </div>
    );
}
