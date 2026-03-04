'use client';
import { useState, useEffect } from 'react';
import { getPortfolio, addPortfolioItem, deletePortfolioItem } from '@/lib/api';
import { Plus, X, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';

export default function PortfolioPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', category: 'logo' });

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await getPortfolio();
            const data = await res.json();
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addPortfolioItem(formData);
            setIsModalOpen(false);
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
                                <label>URL Gambar (Direct Link)</label>
                                <input type="url" required value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className={styles.input} placeholder="https://..." />
                                <small className={styles.helpText}>Contoh: link dari Cloudinary, Imgur, GDrive link, dll.</small>
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
