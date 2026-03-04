'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getInvoice, sendInvoice, cancelInvoice } from '@/lib/api';
import { Send, Copy, XCircle, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import styles from './page.module.css';

export default function InvoiceDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            const res = await getInvoice(id);
            if (res.ok) {
                const data = await res.json();
                setInvoice(data);
            } else {
                alert('Invoice tidak ditemukan');
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

    const handleSend = async () => {
        if (confirm('Kirim invoice ke klien? Status akan berubah menjadi Terkirim dan tidak dapat diubah lagi.')) {
            setLoading(true);
            try {
                const res = await sendInvoice(id);
                if (res.ok) {
                    const data = await res.json();
                    alert(`Link pembayaran berhasil dibuat!\n\n${data.payment_url}`);
                    fetchDetail();
                }
            } catch (e) {
                alert('Gagal mengirim');
            }
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (confirm('Batalkan invoice ini? Invoice yang dibatalkan tidak bisa dibayar klien.')) {
            setLoading(true);
            try {
                await cancelInvoice(id);
                fetchDetail();
            } catch (e) {
                alert('Gagal membatalkan');
            }
            setLoading(false);
        }
    };

    const copyUrl = () => {
        const url = `${window.location.origin}/pay/${invoice.slug}`;
        navigator.clipboard.writeText(url);
        alert('Link pembayaran berhasil disalin ke clipboard!');
    };

    if (loading) return <div className="p-8">Memuat detail invoice...</div>;
    if (!invoice) return null;

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <Link href="/invoices" className={styles.backLink}>
                <ArrowLeft size={16} /> Kembali ke Daftar Invoice
            </Link>

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invoice #{invoice.invoice_number || 'Draft'}</h1>
                    <div className="mt-2">
                        <span className={`${styles.badge} ${styles['badge-' + invoice.status]}`}>
                            {invoice.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    {invoice.status === 'draft' && (
                        <button onClick={handleSend} className={styles.btnPrimary}>
                            <Send size={16} /> Kirim ke Klien & Buat Link Bayar
                        </button>
                    )}

                    {invoice.status === 'sent' && (
                        <>
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
                            <div className="mt-2 text-gray-500">#{invoice.invoice_number || 'DRAFT'}</div>
                        </div>
                        <div className={styles.docMeta}>
                            <div><b>Tanggal Dibuat:</b> {new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
                            {invoice.due_date && <div><b>Jatuh Tempo:</b> {new Date(invoice.due_date).toLocaleDateString('id-ID')}</div>}
                            {invoice.paid_at && <div className="text-green-600"><b>Lunas Pada:</b> {new Date(invoice.paid_at).toLocaleDateString('id-ID')}</div>}
                        </div>
                    </div>

                    <div className={styles.docInfo}>
                        <div className={styles.infoBox}>
                            <span className={styles.infoLabel}>Dari:</span>
                            <strong>{invoice.creator.display_name}</strong>
                            <p>{invoice.creator.profession}</p>
                            <p>{invoice.creator.email}</p>
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
                                <th className="text-center">Qty</th>
                                <th className="text-right">Harga</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td className="text-center">{item.qty}</td>
                                    <td className="text-right">{formatRp(item.unit_price)}</td>
                                    <td className="text-right">{formatRp(item.qty * item.unit_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.docTotals}>
                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatRp(invoice.subtotal)}</span>
                        </div>
                        {invoice.tax_amount > 0 && (
                            <div className="flex justify-between py-2 text-gray-600">
                                <span>Pajak</span>
                                <span>{formatRp(invoice.tax_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-lg mt-2">
                            <span>Total Tagihan</span>
                            <span className="text-blue-600">{formatRp(invoice.total)}</span>
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
                            <strong>Metode Pencairan (Info Internal Klien):</strong>
                            <p>Transfer ke: {invoice.creator.bank_name} - {invoice.creator.bank_account_number} a.n {invoice.creator.bank_account_name}</p>
                        </div>
                    </div>

                    <div className={styles.watermark}>
                        Kreavify
                    </div>
                </div>
            </div>
        </div>
    );
}
