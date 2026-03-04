'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getInvoice, sendInvoice, cancelInvoice, sendReminder, generateContract } from '@/lib/api';
import { Send, Copy, XCircle, ArrowLeft, Download, ExternalLink, Bell, ScrollText } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function InvoiceDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reminderData, setReminderData] = useState(null);
    const [generatingContract, setGeneratingContract] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', variant: 'danger', onConfirm: null });

    const fetchDetail = async () => {
        try {
            const res = await getInvoice(id);
            if (res.ok) {
                const data = await res.json();
                setInvoice(data);
            } else {
                router.push('/invoices');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleSend = () => {
        setConfirmDialog({
            open: true,
            title: 'Kirim Invoice',
            message: 'Invoice akan dikirim ke klien dan link pembayaran akan dibuat. Status akan berubah menjadi Terkirim. Lanjutkan?',
            variant: 'warning',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, open: false }));
                setLoading(true);
                try {
                    const res = await sendInvoice(id);
                    if (res.ok) {
                        const data = await res.json();
                        navigator.clipboard.writeText(data.payment_url);
                        fetchDetail();
                    }
                } catch (e) {
                    console.error(e);
                }
                setLoading(false);
            }
        });
    };

    const handleCancel = () => {
        setConfirmDialog({
            open: true,
            title: 'Batalkan Invoice',
            message: 'Invoice yang dibatalkan tidak bisa dibayar klien. Yakin ingin membatalkan?',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, open: false }));
                setLoading(true);
                try {
                    await cancelInvoice(id);
                    fetchDetail();
                } catch (e) {
                    console.error(e);
                }
                setLoading(false);
            }
        });
    };

    const copyUrl = () => {
        const url = `${window.location.origin}/pay/${invoice.slug}`;
        navigator.clipboard.writeText(url);
    };

    const handleReminder = async () => {
        try {
            const res = await sendReminder(id);
            if (res.ok) {
                const data = await res.json();
                setReminderData(data);
                if (data.whatsapp_url) {
                    window.open(data.whatsapp_url, '_blank');
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleGenerateContract = async () => {
        setGeneratingContract(true);
        try {
            const res = await generateContract(id);
            if (res.ok) {
                const contract = await res.json();
                router.push('/contracts');
            } else {
                const err = await res.json();
                alert(err.error || 'Gagal generate kontrak');
            }
        } catch (e) {
            console.error(e);
        }
        setGeneratingContract(false);
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat detail invoice...</div>;
    if (!invoice) return null;

    const cur = invoice.currency || 'IDR';
    const formatCurrency = (val) => new Intl.NumberFormat(cur === 'IDR' ? 'id-ID' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: 0 }).format(val);
    const creator = invoice.creator || {};

    return (
        <div className={styles.container}>
            <Link href="/invoices" className={styles.backLink}>
                <ArrowLeft size={16} /> Kembali ke Daftar Invoice
            </Link>

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invoice #{invoice.invoice_number || 'Draft'}</h1>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span className={`${styles.badge} ${styles['badge-' + invoice.status]}`}>
                            {invoice.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    {invoice.status === 'draft' && (
                        <button onClick={handleSend} className={styles.btnPrimary}>
                            <Send size={16} /> Kirim ke Klien
                        </button>
                    )}

                    {invoice.status === 'sent' && (
                        <>
                            <button onClick={handleReminder} className={styles.btnOutline}>
                                <Bell size={16} /> Kirim Reminder
                            </button>
                            <a href={`/pay/${invoice.slug}`} target="_blank" rel="noopener noreferrer" className={styles.btnOutline}>
                                <ExternalLink size={16} /> Buka Halaman Bayar
                            </a>
                            <button onClick={copyUrl} className={styles.btnPrimary}>
                                <Copy size={16} /> Salin Link
                            </button>
                            <button onClick={handleCancel} className={styles.btnDanger}>
                                <XCircle size={16} /> Batalkan
                            </button>
                        </>
                    )}

                    <button onClick={handleGenerateContract} className={styles.btnOutline} disabled={generatingContract}>
                        <ScrollText size={16} /> {generatingContract ? 'Generating...' : 'Buat Kontrak'}
                    </button>
                    <button onClick={() => window.print()} className={styles.btnOutline}>
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Document Preview */}
            <div className={styles.documentWrapper}>
                <div className={styles.document}>
                    <div className={styles.docHeader}>
                        <div>
                            <div className={styles.docLogo}>INVOICE</div>
                            <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>#{invoice.invoice_number || 'DRAFT'}</div>
                        </div>
                        <div className={styles.docMeta}>
                            <div><b>Tanggal Dibuat:</b> {new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
                            {invoice.due_date && <div><b>Jatuh Tempo:</b> {new Date(invoice.due_date).toLocaleDateString('id-ID')}</div>}
                            {invoice.paid_at && <div style={{ color: '#059669' }}><b>Lunas Pada:</b> {new Date(invoice.paid_at).toLocaleDateString('id-ID')}</div>}
                        </div>
                    </div>

                    <div className={styles.docInfo}>
                        <div className={styles.infoBox}>
                            <span className={styles.infoLabel}>Dari:</span>
                            <strong>{creator.display_name || '-'}</strong>
                            <p>{creator.profession || ''}</p>
                            <p>{creator.email || ''}</p>
                        </div>
                        <div className={styles.infoBox}>
                            <span className={styles.infoLabel}>Kepada:</span>
                            <strong>{invoice.client_name}</strong>
                            <p>{invoice.client_email || '-'}</p>
                            <p>{invoice.client_phone || '-'}</p>
                        </div>
                    </div>

                    <table className={styles.docTable}>
                        <thead>
                            <tr>
                                <th>Deskripsi</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Harga</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.qty * item.unit_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.docTotals}>
                        <div className={styles.docTotalRow}>
                            <span>Subtotal</span>
                            <span>{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        {invoice.tax_amount > 0 && (
                            <div className={styles.docTotalRow}>
                                <span>Pajak</span>
                                <span>{formatCurrency(invoice.tax_amount)}</span>
                            </div>
                        )}
                        <div className={styles.docTotalRowBold}>
                            <span>Total Tagihan</span>
                            <span style={{ color: 'var(--primary)' }}>{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>

                    <div className={styles.docFooterBox}>
                        {invoice.notes && (
                            <div className={styles.docNotes}>
                                <strong>Catatan:</strong>
                                <p>{invoice.notes}</p>
                            </div>
                        )}

                        <div className={styles.docPaymentInfo}>
                            <strong>Metode Pencairan (Info Internal):</strong>
                            <p>Transfer ke: {creator.bank_name || '-'} - {creator.bank_account_number || '-'} a.n {creator.bank_account_name || '-'}</p>
                        </div>
                    </div>

                    <div className={styles.watermark}>
                        Kreavify
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.open}
                onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
            />
        </div>
    );
}
