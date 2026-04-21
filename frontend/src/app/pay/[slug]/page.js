'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPaymentInvoice, createCheckout, syncPayment } from '@/lib/api';
import { ShieldCheck, Lock, CreditCard, XCircle, Info, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

export default function PaymentPage() {
    const { slug } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [optimisticPaid, setOptimisticPaid] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', title: '', message: '' });

    const openModal = (type, title, message) => setModalConfig({ isOpen: true, type, title, message });
    const closeModal = () => setModalConfig({ isOpen: false, type: '', title: '', message: '' });

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
            const res = await getPaymentInvoice(slug);
            if (res.ok) {
                setInvoice(await res.json());
            } else {
                openModal('error', 'Error', 'Invoice tidak ditemukan atau link kadaluarsa');
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
            const res = await createCheckout(slug);
            const data = await res.json();

            if (res.ok && data.token) {
                // Run midtrans snap
                window.snap.pay(data.token, {
                    onSuccess: async function (result) {
                        try {
                            await syncPayment(slug);
                        } catch (e) {
                            console.error('Failed to sync payment status with backend', e);
                        }
                        setIsProcessing(false);
                        setOptimisticPaid(true);
                        openModal('success', 'Pembayaran Berhasil!', 'Terima kasih, pembayaran Anda telah berhasil kami terima.');
                        fetchInvoice(); // refresh state
                    },
                    onPending: function (result) {
                        setIsProcessing(false);
                        openModal('info', 'Menunggu Pembayaran', 'Silakan selesaikan pembayaran sesuai instruksi yang diberikan.');
                        fetchInvoice();
                    },
                    onError: function (result) {
                        setIsProcessing(false);
                        openModal('error', 'Pembayaran Gagal', 'Terjadi kesalahan pada saat memproses pembayaran Anda.');
                    },
                    onClose: function () {
                        setIsProcessing(false);
                    }
                });
            } else {
                openModal('error', 'Gagal', data.detail || 'Gagal memulai transaksi');
                setIsProcessing(false);
            }
        } catch (e) {
            openModal('error', 'Error', 'Terjadi error server');
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak / Tidak Ditemukan.</div>;

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const isPaid = invoice.status === 'paid' || optimisticPaid;

    return (
        <div className={styles.container}>
            <div className={styles.navBar}>
                <div className={styles.logo}>Kreavify</div>
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
                                    <p className={styles.creatorName}>Dari: {invoice.creator_display_name}</p>
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

            {/* Custom Modal */}
            {modalConfig.isOpen && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.dialog} onClick={e => e.stopPropagation()}>
                        <div className={`${styles.dialogIcon} ${styles[modalConfig.type]}`}>
                            {modalConfig.type === 'success' && <CheckCircle2 size={48} />}
                            {modalConfig.type === 'error' && <XCircle size={48} />}
                            {modalConfig.type === 'info' && <Info size={48} />}
                        </div>
                        <h3 className={styles.dialogTitle}>{modalConfig.title}</h3>
                        <p className={styles.dialogMessage}>{modalConfig.message}</p>
                        <button onClick={closeModal} className={styles.dialogBtn}>Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}
