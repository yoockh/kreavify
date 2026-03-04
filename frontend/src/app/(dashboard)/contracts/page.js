'use client';
import { useState, useEffect } from 'react';
import { getContracts, getInvoices, generateContract, deleteContract } from '@/lib/api';
import { ScrollText, Plus, Trash2, Eye, FileText, Loader } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function ContractsPage() {
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
            title: 'Hapus Kontrak',
            message: 'Kontrak yang dihapus tidak bisa dikembalikan. Lanjutkan?',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, open: false }));
                await deleteContract(id);
                setContracts(prev => prev.filter(c => c.id !== id));
                if (viewContract?.id === id) setViewContract(null);
            }
        });
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat kontrak...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kontrak Digital</h1>
                    <p className={styles.subtitle}>Generate kontrak kerja freelance otomatis dari invoice dengan AI</p>
                </div>
                <button onClick={() => setShowGenerateModal(true)} className={styles.generateBtn}>
                    <Plus size={18} /> Generate Kontrak Baru
                </button>
            </div>

            {/* Generate Modal */}
            {showGenerateModal && (
                <div className={styles.modalOverlay} onClick={() => !generating && setShowGenerateModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Generate Kontrak dari Invoice</h3>
                        <p className={styles.modalDesc}>Pilih invoice untuk dijadikan basis kontrak. AI akan generate kontrak lengkap secara otomatis.</p>
                        <select
                            value={selectedInvoice}
                            onChange={(e) => setSelectedInvoice(e.target.value)}
                            className={styles.input}
                            disabled={generating}
                        >
                            <option value="">Pilih Invoice...</option>
                            {invoices.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    #{inv.invoice_number || 'Draft'} — {inv.client_name} — Rp {Number(inv.total).toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowGenerateModal(false)} className={styles.cancelBtn} disabled={generating}>Batal</button>
                            <button onClick={handleGenerate} className={styles.confirmBtn} disabled={!selectedInvoice || generating}>
                                {generating ? <><Loader size={16} className={styles.spin} /> Generating...</> : <><ScrollText size={16} /> Generate dengan AI</>}
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
                            <p>Belum ada kontrak</p>
                            <span>Klik "Generate Kontrak Baru" untuk mulai.</span>
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
                                <button onClick={() => window.print()} className={styles.printBtn}>Cetak / PDF</button>
                            </div>
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: viewContract.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/#{3}\s(.*?)(<br\/>)/g, '<h3>$1</h3>').replace(/#{2}\s(.*?)(<br\/>)/g, '<h2>$1</h2>').replace(/#{1}\s(.*?)(<br\/>)/g, '<h1>$1</h1>') }} />
                        </div>
                    ) : (
                        <div className={styles.emptyPreview}>
                            <ScrollText size={64} />
                            <p>Pilih kontrak untuk melihat preview</p>
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
