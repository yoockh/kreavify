'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice, getProfile } from '@/lib/api';
import { Trash2, Plus, Brain } from 'lucide-react';
import AIPricingModal from '@/components/AIPricingModal';
import styles from './page.module.css';

export default function CreateInvoice() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(null);

    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        notes: '',
        tax_percentage: 0,
        due_date: '',
        items: [
            { description: '', qty: 1, unit_price: 0 }
        ]
    });

    useEffect(() => {
        getProfile()
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(console.error);
    }, []);

    const calculateSubtotal = () => {
        return formData.items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = subtotal * (formData.tax_percentage / 100);
        return subtotal + tax;
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        if (field === 'qty' || field === 'unit_price') {
            value = parseInt(value) || 0;
        }
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', qty: 1, unit_price: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const openAIModal = (index) => {
        setActiveItemIndex(index);
        setIsAIModalOpen(true);
    };

    const applyAIPrice = (price) => {
        if (activeItemIndex !== null) {
            handleItemChange(activeItemIndex, 'unit_price', price);
        }
        setIsAIModalOpen(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validItems = formData.items.filter(i => i.description && i.unit_price > 0);
        if (validItems.length === 0) {
            alert('Minimal ada 1 item jasa yang diisi');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                items: validItems
            };
            if (!payload.due_date) delete payload.due_date;
            if (!payload.client_email) delete payload.client_email;
            if (!payload.client_phone) delete payload.client_phone;

            const res = await createInvoice(payload);

            if (res.ok) {
                router.push('/invoices');
            } else {
                const err = await res.json();
                alert('Gagal menyimpan invoice: ' + JSON.stringify(err));
            }
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.layout}>
            {/* Form Kiri */}
            <div className={styles.formSection}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Buat Invoice Baru</h1>
                    <p className={styles.subtitle}>Isi detail tagihan untuk klien kamu</p>
                </div>

                <form onSubmit={handleSave} className={styles.formContainer}>
                    {/* Client Info */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Info Klien</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Nama Klien / Perusahaan *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.client_name}
                                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                    className={styles.input}
                                    placeholder="Misal: PT Karya Bangsa"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Klien (Opsional)</label>
                                <input
                                    type="email"
                                    value={formData.client_email}
                                    onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                                    className={styles.input}
                                    placeholder="client@mail.com"
                                />
                            </div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>No. Telepon Klien (Opsional)</label>
                                <input
                                    type="tel"
                                    value={formData.client_phone}
                                    onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                                    className={styles.input}
                                    placeholder="08123456789"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Batas Waktu Bayar (Opsional)</label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Item Jasa</h2>

                        <div className={styles.itemsList}>
                            {formData.items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <div className={styles.itemMain}>
                                        <div className={styles.formGroup}>
                                            <label>Deskripsi Jasa</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                className={styles.input}
                                                placeholder="Desain Logo..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.itemMeta}>
                                        <div className={styles.formGroup} style={{ width: '80px' }}>
                                            <label>Qty</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={e => handleItemChange(index, 'qty', e.target.value)}
                                                className={styles.input}
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <span>Harga Satuan (Rp)</span>
                                                {item.description && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openAIModal(index)}
                                                        className={styles.aiBtnText}
                                                    >
                                                        <Brain size={12} style={{ marginRight: '4px' }} /> AI Suggest
                                                    </button>
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                                                className={styles.input}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className={styles.removeItemBtn}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addItem} className={styles.addItemBtn}>
                            <Plus size={16} /> Tambah Kolom Item
                        </button>
                    </div>

                    {/* Settings & Calc */}
                    <div className={`${styles.card} ${styles.calcCard}`}>
                        <div className={styles.calcLeft}>
                            <div className={styles.formGroup}>
                                <label>Pajak / PPN (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={formData.tax_percentage}
                                    onChange={e => setFormData({ ...formData, tax_percentage: parseFloat(e.target.value) || 0 })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Catatan untuk Klien</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows="3"
                                    className={styles.input}
                                    placeholder="Terima kasih atas kerjasamanya..."
                                />
                            </div>
                        </div>

                        <div className={styles.calcRight}>
                            <div className={styles.calcRow}>
                                <span className={styles.calcLabel}>Subtotal:</span>
                                <span className={styles.calcValue}>{formatRp(calculateSubtotal())}</span>
                            </div>
                            {formData.tax_percentage > 0 && (
                                <div className={styles.calcRow}>
                                    <span className={styles.calcLabel}>Pajak ({formData.tax_percentage}%):</span>
                                    <span className={styles.calcValue}>{formatRp(calculateSubtotal() * (formData.tax_percentage / 100))}</span>
                                </div>
                            )}
                            <div className={`${styles.calcRow} ${styles.totalRow}`}>
                                <span className={styles.totalLabel}>Total Pembayaran:</span>
                                <span className={styles.totalValue}>{formatRp(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionsBox}>
                        <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>Batalkan</button>
                        <button type="submit" disabled={loading} className={styles.saveBtn}>
                            {loading ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Kanan */}
            <div className={styles.previewSection}>
                <div className={styles.previewSticky}>
                    <h3 className={styles.previewTitle}>Live Preview</h3>

                    <div className={styles.document}>
                        <div className={styles.docHeader}>
                            <div className={styles.docLogo}>INVOICE</div>
                            <div className={styles.docMeta}>
                                <div><b>Tanggal:</b> {new Date().toLocaleDateString('id-ID')}</div>
                                <div><b>Jatuh Tempo:</b> {formData.due_date ? new Date(formData.due_date).toLocaleDateString('id-ID') : '-'}</div>
                            </div>
                        </div>

                        <div className={styles.docInfo}>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Dari:</span>
                                <strong>{profile?.display_name || '...'}</strong>
                                <p>{profile?.profession}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Kepada:</span>
                                <strong>{formData.client_name || '-'}</strong>
                                <p>{formData.client_email}</p>
                                <p>{formData.client_phone}</p>
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
                                {formData.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.description || '-'}</td>
                                        <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                        <td style={{ textAlign: 'right' }}>{formatRp(item.unit_price)}</td>
                                        <td style={{ textAlign: 'right' }}>{formatRp(item.qty * item.unit_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.docTotals}>
                            <div className={styles.docTotalRow}>
                                <span>Subtotal</span>
                                <span>{formatRp(calculateSubtotal())}</span>
                            </div>
                            <div className={styles.docTotalRow}>
                                <span>Pajak ({formData.tax_percentage}%)</span>
                                <span>{formatRp(calculateSubtotal() * (formData.tax_percentage / 100))}</span>
                            </div>
                            <div className={styles.docTotalRowBold}>
                                <span>Total</span>
                                <span className={styles.totalValue}>{formatRp(calculateTotal())}</span>
                            </div>
                        </div>

                        {formData.notes && (
                            <div className={styles.docNotes}>
                                <strong>Catatan:</strong>
                                <p>{formData.notes}</p>
                            </div>
                        )}

                        <div className={styles.docFooterLine}>
                            Dibuat dengan <b>Kreavify</b>
                        </div>
                    </div>
                </div>
            </div>

            <AIPricingModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                initialDescription={activeItemIndex !== null ? formData.items[activeItemIndex].description : ''}
                onApplyPrice={applyAIPrice}
            />
        </div>
    );
}
