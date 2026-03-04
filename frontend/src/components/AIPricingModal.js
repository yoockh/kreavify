'use client';
import { useState } from 'react';
import { getAIPricing } from '@/lib/api';
import { Brain, X, Check } from 'lucide-react';
import styles from './aiPricingModal.module.css';

export default function AIPricingModal({ isOpen, onClose, initialDescription, onApplyPrice }) {
    const [description, setDescription] = useState(initialDescription || '');
    const [targetMarket, setTargetMarket] = useState('UMKM Indonesia');
    const [complexity, setComplexity] = useState('menengah');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCheck = async () => {
        if (!description.trim()) {
            setError('Deskripsi jasa tidak boleh kosong');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await getAIPricing({
                service_description: description,
                target_market: targetMarket,
                complexity: complexity
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                const err = await res.json();
                setError(err.detail || 'Gagal menghitung harga');
            }
        } catch (e) {
            setError('Terjadi kesalahan sambungan limit AI.');
        } finally {
            setLoading(false);
        }
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <Brain className={styles.icon} size={24} />
                        <h2 className={styles.title}>AI Pricing Assistant</h2>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label>Deskripsikan Jasa Kamu</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contoh: Desain logo dan identitas visual perusahaan makanan ringan. Termasuk 3 revisi dan manual grafis standar."
                            rows="3"
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Target Market</label>
                            <select value={targetMarket} onChange={e => setTargetMarket(e.target.value)}>
                                <option value="Event Pribadi / Personal">Personal</option>
                                <option value="UMKM Indonesia">UMKM</option>
                                <option value="Startup">Startup</option>
                                <option value="Korporat Menengah">Korporat Menengah</option>
                                <option value="Korporat Besar / Multinasional">Korporat Besar</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Kompleksitas</label>
                            <select value={complexity} onChange={e => setComplexity(e.target.value)}>
                                <option value="sangat_sederhana">Sangat Sederhana</option>
                                <option value="sederhana">Sederhana</option>
                                <option value="menengah">Menengah</option>
                                <option value="kompleks">Kompleks</option>
                                <option value="sangat_kompleks">Sangat Kompleks</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className={styles.checkBtn}
                    >
                        {loading ? 'Menghitung Harga...' : 'Cek Harga Wajar'}
                    </button>

                    {error && <div className={styles.error}>{error}</div>}

                    {result && (
                        <div className={styles.resultContainer}>
                            <div className={styles.priceRange}>
                                <div>
                                    <div className={styles.priceLabel}>Estimasi Harga Pasar:</div>
                                    <div className={styles.priceValue}>
                                        {formatRp(result.suggested_min)} - {formatRp(result.suggested_max)}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.explanation}>
                                <p>{result.explanation}</p>
                            </div>

                            <div className={styles.factors}>
                                <strong>Faktor Penentu:</strong>
                                <ul>
                                    {result.factors?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>

                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => onApplyPrice(result.suggested_min)}
                                    className={styles.applyBtnOutline}
                                >
                                    Gunakan Harga Min
                                </button>
                                <button
                                    onClick={() => onApplyPrice(result.suggested_max)}
                                    className={styles.applyBtnFill}
                                >
                                    <Check size={16} /> Gunakan Harga Max
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
