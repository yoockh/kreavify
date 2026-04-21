'use client';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { getContracts, getInvoices, generateContract, deleteContract } from '@/lib/api';
import { ScrollText, Plus, Trash2, Eye, FileText, Loader } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function ContractsPage() {
    const { t } = useI18n();
    const [contracts, setContracts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [viewContract, setViewContract] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

    const fetchData = async () => {
        try {
            const [cRes, iRes] = await Promise.all([getContracts(), getInvoices()]);
            if (cRes.ok) {
                const cData = await cRes.json();
                setContracts(Array.isArray(cData) ? cData : (cData.results || []));
            }
            if (iRes.ok) {
                const iData = await iRes.json();
                setInvoices(Array.isArray(iData) ? iData : (iData.results || []));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleGenerate = async () => {
        if (!selectedInvoice) return;
        setGenerating(true);
        try {
            const res = await generateContract(selectedInvoice);
            if (res.ok) {
                const contract = await res.json();
                setContracts(prev => [contract, ...prev]);
                setShowGenerateModal(false);
                setSelectedInvoice('');
                setViewContract(contract);
            } else {
                const err = await res.json();
                alert(err.error || 'Gagal generate kontrak');
            }
        } catch (e) {
            alert('Gagal generate kontrak');
        }
        setGenerating(false);
    };

    const handleDelete = (id) => {
        setConfirmDialog({
            open: true,
            title: t('contractsPage.deleteTitle'),
            message: t('contractsPage.deleteConfirm'),
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, open: false }));
                await deleteContract(id);
                setContracts(prev => prev.filter(c => c.id !== id));
                if (viewContract?.id === id) setViewContract(null);
            }
        });
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>{t('contractsPage.loading')}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('contractsPage.title')}</h1>
                    <p className={styles.subtitle}>{t('contractsPage.subtitle')}</p>
                </div>
                <button onClick={() => setShowGenerateModal(true)} className={styles.generateBtn}>
                    <Plus size={18} /> {t('contractsPage.generateNew')}
                </button>
            </div>

            {/* Generate Modal */}
            {showGenerateModal && (
                <div className={styles.modalOverlay} onClick={() => !generating && setShowGenerateModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>{t('contractsPage.modalTitle')}</h3>
                        <p className={styles.modalDesc}>{t('contractsPage.modalDesc')}</p>
                        <select
                            value={selectedInvoice}
                            onChange={(e) => setSelectedInvoice(e.target.value)}
                            className={styles.input}
                            disabled={generating}
                        >
                            <option value="">{t('contractsPage.selectInvoice')}</option>
                            {invoices.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    #{inv.invoice_number || 'Draft'} — {inv.client_name} — Rp {Number(inv.total).toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowGenerateModal(false)} className={styles.cancelBtn} disabled={generating}>{t('contractsPage.cancel')}</button>
                            <button onClick={handleGenerate} className={styles.confirmBtn} disabled={!selectedInvoice || generating}>
                                {generating ? <><Loader size={16} className={styles.spin} /> {t('contractsPage.generating')}</> : <><ScrollText size={16} /> {t('contractsPage.generateWithAI')}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                {/* Contract List */}
                <div className={styles.listPanel}>
                    {contracts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ScrollText size={48} />
                            <p>{t('contractsPage.noContracts')}</p>
                            <span>{t('contractsPage.noContractsDesc')}</span>
                        </div>
                    ) : (
                        contracts.map(c => (
                            <div
                                key={c.id}
                                className={`${styles.contractItem} ${viewContract?.id === c.id ? styles.activeItem : ''}`}
                                onClick={() => setViewContract(c)}
                            >
                                <div className={styles.contractMeta}>
                                    <FileText size={18} />
                                    <div>
                                        <h4 className={styles.contractTitle}>{c.title}</h4>
                                        <span className={styles.contractDate}>{new Date(c.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                                <div className={styles.contractActions}>
                                    <button onClick={(e) => { e.stopPropagation(); setViewContract(c); }} title="Lihat">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} title="Hapus" className={styles.deleteBtn}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Contract Preview */}
                <div className={styles.previewPanel}>
                    {viewContract ? (
                        <div className={styles.previewContent}>
                            <div className={styles.previewHeader}>
                                <h2>{viewContract.title}</h2>
                                <button onClick={() => window.print()} className={styles.printBtn}>{t('contractsPage.printPDF')}</button>
                            </div>
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: viewContract.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/#{3}\s(.*?)(<br\/>)/g, '<h3>$1</h3>').replace(/#{2}\s(.*?)(<br\/>)/g, '<h2>$1</h2>').replace(/#{1}\s(.*?)(<br\/>)/g, '<h1>$1</h1>') }} />
                        </div>
                    ) : (
                        <div className={styles.emptyPreview}>
                            <ScrollText size={64} />
                            <p>{t('contractsPage.previewPlaceholder')}</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.open}
                onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant="danger"
            />
        </div>
    );
}
