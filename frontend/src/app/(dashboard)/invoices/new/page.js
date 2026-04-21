'use client';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice, getProfile } from '@/lib/api';
import { Trash2, Plus, Brain } from 'lucide-react';
import AIPricingModal from '@/components/AIPricingModal';
import styles from './page.module.css';

export default function CreateInvoice() {
    const { t } = useI18n();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(null);

    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        due_date: '',
        notes: '',
        currency: 'IDR',
        tax_percentage: '',
        items: [
            { description: '', qty: 1, unit_price: '' }
        ]
    });

    useEffect(() => {
        getProfile()
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(console.error);
    }, []);

    const calculateSubtotal = () => {
        return formData.items.reduce((acc, item) => {
            const qty = parseInt(item.qty) || 0;
            const price = parseInt(item.unit_price) || 0;
            return acc + (qty * price);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxPercent = parseFloat(formData.tax_percentage) || 0;
        const tax = subtotal * (taxPercent / 100);
        return subtotal + tax;
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        // Allow empty strings for nice typing, parse to int ONLY if evaluating
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', qty: 1, unit_price: '' }]
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
                    <h1 className={styles.title}>{t('createInvoicePage.title')}</h1>
                    <p className={styles.subtitle}>{t('createInvoicePage.subtitle')}</p>
                </div>

                <form onSubmit={handleSave} className={styles.formContainer}>
                    {/* Client Info */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{t('createInvoicePage.clientInfo')}</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.clientName')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.client_name}
                                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                    className={styles.input}
                                    placeholder={t('createInvoicePage.clientNamePh')}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.clientEmail')}</label>
                                <input
                                    type="email"
                                    value={formData.client_email}
                                    onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                                    className={styles.input}
                                    placeholder={t('createInvoicePage.clientEmailPh')}
                                />
                            </div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.clientPhone')}</label>
                                <input
                                    type="tel"
                                    value={formData.client_phone}
                                    onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                                    className={styles.input}
                                    placeholder={t('createInvoicePage.clientPhonePh')}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.dueDate')}</label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.currency')}</label>
                                <select
                                    value={formData.currency}
                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                    className={styles.input}
                                >
                                    <option value="IDR">{t('createInvoicePage.currIDR')}</option>
                                    <option value="USD">{t('createInvoicePage.currUSD')}</option>
                                    <option value="SGD">{t('createInvoicePage.currSGD')}</option>
                                    <option value="EUR">{t('createInvoicePage.currEUR')}</option>
                                    <option value="MYR">{t('createInvoicePage.currMYR')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{t('createInvoicePage.serviceItems')}</h2>

                        <div className={styles.itemsList}>
                            {formData.items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <div className={styles.itemMain}>
                                        <div className={styles.formGroup}>
                                            <label>{t('createInvoicePage.serviceDesc')}</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                className={styles.input}
                                                placeholder={t('createInvoicePage.serviceDescPh')}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.itemMeta}>
                                        <div className={styles.formGroup} style={{ width: '80px' }}>
                                            <label>{t('createInvoicePage.qty')}</label>
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
                                                <span>{t('createInvoicePage.unitPrice')}</span>
                                                {item.description && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openAIModal(index)}
                                                        className={styles.aiBtnText}
                                                    >
                                                        <Brain size={12} style={{ marginRight: '4px' }} /> {t('createInvoicePage.aiSuggest')}
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
                            <Plus size={16} /> {t('createInvoicePage.addCol')}
                        </button>
                    </div>

                    {/* Settings & Calc */}
                    <div className={`${styles.card} ${styles.calcCard}`}>
                        <div className={styles.calcLeft}>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.taxPercent')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={formData.tax_percentage}
                                    onChange={e => setFormData({ ...formData, tax_percentage: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>{t('createInvoicePage.clientNote')}</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows="3"
                                    className={styles.input}
                                    placeholder={t('createInvoicePage.clientNotePh')}
                                />
                            </div>
                        </div>

                        <div className={styles.calcRight}>
                            <div className={styles.calcRow}>
                                <span className={styles.calcLabel}>{t('createInvoicePage.subtotal')}</span>
                                <span className={styles.calcValue}>{formatRp(calculateSubtotal())}</span>
                            </div>
                            {formData.tax_percentage > 0 && (
                                <div className={styles.calcRow}>
                                    <span className={styles.calcLabel}>{t('createInvoicePage.taxLabel')} ({formData.tax_percentage}%):</span>
                                    <span className={styles.calcValue}>{formatRp(calculateSubtotal() * (formData.tax_percentage / 100))}</span>
                                </div>
                            )}
                            <div className={`${styles.calcRow} ${styles.totalRow}`}>
                                <span className={styles.totalLabel}>{t('createInvoicePage.totalPay')}</span>
                                <span className={styles.totalValue}>{formatRp(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionsBox}>
                        <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>{t('createInvoicePage.cancel')}</button>
                        <button type="submit" disabled={loading} className={styles.saveBtn}>
                            {loading ? t('createInvoicePage.saving') : t('createInvoicePage.saveDraft')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Kanan */}
            <div className={styles.previewSection}>
                <div className={styles.previewSticky}>
                    <h3 className={styles.previewTitle}>{t('createInvoicePage.livePreview')}</h3>

                    <div className={styles.document}>
                        <div className={styles.docHeader}>
                            <div className={styles.docLogo}>{t('createInvoicePage.invoiceTag')}</div>
                            <div className={styles.docMeta}>
                                <div><b>{t('createInvoicePage.date')}</b> {new Date().toLocaleDateString('id-ID')}</div>
                                <div><b>{t('createInvoicePage.dueDatePreview')}</b> {formData.due_date ? new Date(formData.due_date).toLocaleDateString('id-ID') : '-'}</div>
                            </div>
                        </div>

                        <div className={styles.docInfo}>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>{t('createInvoicePage.from')}</span>
                                <strong>{profile?.display_name || '...'}</strong>
                                <p>{profile?.profession}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>{t('createInvoicePage.to')}</span>
                                <strong>{formData.client_name || '-'}</strong>
                                <p>{formData.client_email}</p>
                                <p>{formData.client_phone}</p>
                            </div>
                        </div>

                        <table className={styles.docTable}>
                            <thead>
                                <tr>
                                    <th>{t('createInvoicePage.descHeader')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('createInvoicePage.qty')}</th>
                                    <th style={{ textAlign: 'right' }}>{t('createInvoicePage.priceHeader')}</th>
                                    <th style={{ textAlign: 'right' }}>{t('createInvoicePage.totalHeader')}</th>
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
                                <span>{t('createInvoicePage.taxLabel')} ({formData.tax_percentage}%)</span>
                                <span>{formatRp(calculateSubtotal() * (formData.tax_percentage / 100))}</span>
                            </div>
                            <div className={styles.docTotalRowBold}>
                                <span>{t('createInvoicePage.totalHeader')}</span>
                                <span className={styles.totalValue}>{formatRp(calculateTotal())}</span>
                            </div>
                        </div>

                        {formData.notes && (
                            <div className={styles.docNotes}>
                                <strong>{t('createInvoicePage.noteLabel')}</strong>
                                <p>{formData.notes}</p>
                            </div>
                        )}

                        <div className={styles.docFooterLine}>
                            {t('createInvoicePage.madeWith')} <b>Kreavify</b>
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
