'use client';
import { useState, useEffect } from 'react';
import { getPortfolio, addPortfolioItem, deletePortfolioItem } from '@/lib/api';
import { Plus, X, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';

export default function PortfolioPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', category: 'logo' });

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await getPortfolio();
            const data = await res.json();
            setItems(data.results || data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const { uploadImage } = await import('@/lib/api');
            const res = await uploadImage(file, 'portfolio');
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image_url: data.url }));
            } else {
                alert('Gagal upload gambar');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat upload gambar');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addPortfolioItem(formData);
            setIsModalOpen(false);
            setFormData({ title: '', description: '', image_url: '', category: 'logo' });
            fetchPortfolio();
        } catch (e) {
            alert('Gagal menambah portfolio');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus item ini?')) return;
        try {
            await deletePortfolioItem(id);
            fetchPortfolio();
        } catch (e) {
            alert('Gagal menghapus');
        }
    };

    if (loading) return <div className="p-8">Memuat portfolio...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Portfolio Karya</h1>
                    <p className={styles.subtitle}>Tampilkan hasil karya terbaikmu ke publik</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
                    <Plus size={20} /> Tambah Karya
                </button>
            </div>

            {items.length === 0 ? (
                <div className={styles.emptyState}>
                    <ImageIcon size={48} className={styles.emptyIcon} />
                    <h3>Belum ada karya</h3>
                    <p>Tunjukkan hasil kerjamu agar klien semakin yakin memakai jasamu.</p>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addBtnOutline}>+ Tambah Karya</button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {items.map(item => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={item.image_url} alt={item.title} className={styles.image} />
                                <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn} title="Hapus Karya">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className={styles.content}>
                                <span className={styles.category}>{item.category.replace('_', ' ')}</span>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                {item.description && <p className={styles.description}>{item.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Tambah Portfolio</h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Judul Karya</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pilih Kategori</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={styles.input}>
                                    <option value="logo">Desain Logo</option>
                                    <option value="branding">Branding & Identity</option>
                                    <option value="social_media">Desain Social Media</option>
                                    <option value="illustration">Ilustrasi</option>
                                    <option value="photo_product">Foto Produk</option>
                                    <option value="photo_event">Foto Event</option>
                                    <option value="video_promo">Video Promosi</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Gambar Portfolio</label>
                                {formData.image_url ? (
                                    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                                        <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image_url: '' })}
                                            style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="portfolio-img-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: uploading ? 'not-allowed' : 'pointer', width: '100%', justifyContent: 'center', color: 'var(--text-main)', opacity: uploading ? 0.7 : 1 }}>
                                            <ImageIcon size={18} /> {uploading ? 'Mengupload...' : 'Pilih Gambar dari Perangkat'}
                                        </label>
                                        <input id="portfolio-img-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                                        <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>atau</div>
                                        <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className={styles.input} placeholder="https://link-gambar.com/img.jpg" />
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Cerita Singkat / Deskripsi (Opsional)</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={styles.input} />
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Batal</button>
                                <button type="submit" className={styles.saveBtn}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
