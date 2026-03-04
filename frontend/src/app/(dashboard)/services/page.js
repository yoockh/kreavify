'use client';
import { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import AIPricingModal from '@/components/AIPricingModal';
import { Plus, X } from 'lucide-react';
import styles from './page.module.css';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        base_price: '',
        category: 'logo'
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await getServices();
            const data = await res.json();
            setServices(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setFormData({ title: '', description: '', base_price: '', category: 'logo' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setFormData({
            title: service.title,
            description: service.description,
            base_price: service.base_price.toString(),
            category: service.category
        });
        setEditingId(service.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            base_price: parseInt(formData.base_price) || 0
        };

        try {
            if (editingId) {
                await updateService(editingId, payload);
            } else {
                await createService(payload);
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (e) {
            alert('Gagal menyimpan jasa');
        }
    };

    const handleToggle = async (service) => {
        try {
            await updateService(service.id, { is_active: !service.is_active });
            fetchServices();
        } catch (e) {
            alert('Gagal update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus jasa ini?')) return;
        try {
            await deleteService(id);
            fetchServices();
        } catch (e) {
            alert('Gagal menghapus jasa');
        }
    };

    const handleApplyAIPrice = (price) => {
        setFormData({ ...formData, base_price: price.toString() });
        setIsAIModalOpen(false);
    };

    if (loading) return <div className="p-8">Memuat jasa...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Jasa Saya</h1>
                    <p className={styles.subtitle}>Kelola jasa yang kamu tawarkan ke klien</p>
                </div>
                <button onClick={openAddModal} className={styles.addBtn}>
                    <Plus size={20} /> Tambah Jasa
                </button>
            </div>

            {services.length === 0 ? (
                <div className={styles.emptyState}>
                    <Briefcase size={48} className={styles.emptyIcon} />
                    <h3>Belum ada jasa</h3>
                    <p>Mulai tambahkan jasa pertamamu agar klien bisa melihat penawaranmu.</p>
                    <button onClick={openAddModal} className={styles.addBtnOutline}>+ Tambah Jasa</button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {services.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onToggle={handleToggle}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{editingId ? 'Edit Jasa' : 'Tambah Jasa Baru'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Judul Jasa</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className={styles.input}
                                    placeholder="Misal: Desain Logo Premium"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className={styles.input}
                                >
                                    <option value="logo">Desain Logo</option>
                                    <option value="branding">Branding & Identity</option>
                                    <option value="social_media">Desain Social Media</option>
                                    <option value="illustration">Ilustrasi</option>
                                    <option value="photo_product">Foto Produk</option>
                                    <option value="photo_event">Foto Event</option>
                                    <option value="video_promo">Video Promosi</option>
                                    <option value="video_event">Video Event</option>
                                    <option value="copywriting">Copywriting</option>
                                    <option value="translation">Penerjemahan</option>
                                    <option value="music">Produksi Musik</option>
                                    <option value="web_dev">Web Development</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Deskripsi Detail</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className={styles.input}
                                    placeholder="Jelaskan apa saja yang didapat klien..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.priceLabelRow}>
                                    <span>Harga Dasar (Rp)</span>
                                    <button type="button" onClick={() => setIsAIModalOpen(true)} className={styles.aiBtn}>
                                        Cek Harga AI ✨
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={formData.base_price}
                                    onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                                    required
                                    min="0"
                                    className={styles.input}
                                    placeholder="500000"
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Batal</button>
                                <button type="submit" className={styles.saveBtn}>Simpan Jasa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AI Pricing Modal */}
            <AIPricingModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                initialDescription={formData.description}
                onApplyPrice={handleApplyAIPrice}
            />
        </div>
    );
}

// Just adding a quick placeholder icon since Briefcase wasn't imported from lucide-react in time.
import { Briefcase } from 'lucide-react';
