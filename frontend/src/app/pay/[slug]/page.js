'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPublicInvoice, checkoutInvoice } from '@/lib/api';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';
import styles from './page.module.css';

export default function PaymentPage() {
    const { slug } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Need to dynamically add Midtrans script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'SB-Mid-client-XXXXX'); // We'll just rely on what's injected by Snap
        document.head.appendChild(script);

        fetchInvoice();

        return () => {
            document.head.removeChild(script);
        };
    }, [slug]);

    const fetchInvoice = async () => {
        try {
            const res = await getPublicInvoice(slug);
            if (res.ok) {
                setInvoice(await res.json());
            } else {
                alert('Invoice tidak ditemukan atau link kadaluarsa');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        setIsProcessing(true);
        try {
            const res = await checkoutInvoice(slug);
            const data = await res.json();

            if (res.ok && data.token) {
                // Run midtrans snap
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        alert('Pembayaran Berhasil!');
                        fetchInvoice(); // refresh state
                    },
                    onPending: function (result) {
                        alert('Menunggu pembayaran diselesaikan.');
                        fetchInvoice();
                    },
                    onError: function (result) {
                        alert('Terjadi kesalahan pada pembayaran');
                    },
                    onClose: function () {
                        setIsProcessing(false);
                    }
                });
            } else {
                alert(data.detail || 'Gagal memulai transaksi');
                setIsProcessing(false);
            }
        } catch (e) {
            alert('Terjadi error server');
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak / Tidak Ditemukan.</div>;

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const isPaid = invoice.status === 'paid';

    return (
        <div className={styles.container}>
            <div className={styles.navBar}>
                <div className={styles.logo}>KaryaKita</div>
                <div className={styles.safeSecure}>
                    <Lock size={16} /> <span>Secure Payment</span>
                </div>
            </div>

            <main className={styles.main}>
                <div className={styles.layout}>

                    {/* Bagian Kiri: Detail Invoice */}
                    <div className={styles.invoiceSection}>
                        <div className={styles.invoiceBox}>
                            <div className={styles.boxHeader}>
                                <div>
                                    <h1 className={styles.invNumber}>Invoice #{invoice.invoice_number}</h1>
                                    <p className={styles.creatorName}>Dari: {invoice.creator.display_name}</p>
                                </div>
                                <div className={styles.statusBadge}>
                                    {isPaid ? (
                                        <span className={styles.badgePaid}><ShieldCheck size={16} /> LUNAS</span>
                                    ) : invoice.status === 'draft' ? (
                                        <span className={styles.badgeDraft}>Tagihan Belum Siap</span>
                                    ) : (
                                        <span className={styles.badgeUnpaid}>Menunggu Pembayaran</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.itemsTable}>
                                {invoice.items.map((item, i) => (
                                    <div key={i} className={styles.itemRow}>
                                        <div className={styles.itemDesc}>
                                            <strong>{item.description}</strong>
                                            <span className={styles.itemQty}>{item.qty}x {formatRp(item.unit_price)}</span>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            {formatRp(item.qty * item.unit_price)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryArea}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>{formatRp(invoice.subtotal)}</span>
                                </div>
                                {invoice.tax_amount > 0 && (
                                    <div className={styles.summaryRow}>
                                        <span>Pajak</span>
                                        <span>{formatRp(invoice.tax_amount)}</span>
                                    </div>
                                )}
                                <div className={styles.summaryRowMain}>
                                    <span>Total yang harus dibayar</span>
                                    <span className={styles.grandTotal}>{formatRp(invoice.total)}</span>
                                </div>
                            </div>

                            {invoice.notes && (
                                <div className={styles.notes}>
                                    <strong>Catatan dari Kreator:</strong>
                                    <p>{invoice.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bagian Kanan: Aksi Pembayaran */}
                    <div className={styles.paymentSection}>
                        <div className={styles.payCard}>
                            {isPaid ? (
                                <div className={styles.successState}>
                                    <div className={styles.successIcon}><ShieldCheck size={48} /></div>
                                    <h3 className={styles.successTitle}>Pembayaran Berhasil!</h3>
                                    <p className={styles.successDesc}>Terima kasih, pembayaran Anda telah diterima oleh kreator pada tanggal {new Date(invoice.paid_at).toLocaleDateString('id-ID')}.</p>

                                    <button onClick={() => window.print()} className={styles.printBtn}>
                                        Simpan / Cetak Bukti PDF
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className={styles.payTitle}>Selesaikan Pembayaran</h2>
                                    <p className={styles.payDesc}>Anda akan diarahkan ke sistem pembayaran aman (Midtrans) untuk memilih metode pembayaran via QRIS, Virtual Account, atau e-Wallet.</p>

                                    <div className={styles.methodsShowcase}>
                                        <div className={styles.methodMock}>QRIS</div>
                                        <div className={styles.methodMock}>GoPay</div>
                                        <div className={styles.methodMock}>BCA/Mandiri/BNI VA</div>
                                        <div className={styles.methodMock}>ShopeePay</div>
                                    </div>

                                    <button
                                        onClick={handlePay}
                                        disabled={isProcessing || invoice.status === 'draft'}
                                        className={styles.proceedBtn}
                                    >
                                        {isProcessing ? 'Memproses...' : (
                                            <>
                                                <CreditCard size={20} /> Bayar {formatRp(invoice.total)}
                                            </>
                                        )}
                                    </button>
                                    <p className={styles.secureNote}>
                                        <Lock size={12} /> Ditenagai oleh Midtrans. Transaksi Anda 100% aman dan terenkripsi.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
