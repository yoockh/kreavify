'use client';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import { getPricingRecommendation } from '@/lib/ml-api';
import { formatCurrency } from '@/lib/utils';
import ServiceCard from '@/components/ServiceCard';
import AIPricingModal from '@/components/AIPricingModal';
import { Plus, X, Briefcase, Brain, Loader2, ChevronDown } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function ServicesPage() {
    const { t } = useI18n();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', variant: 'danger', onConfirm: null });

    // ML Pricing suggestion state
    const [mlSuggestion, setMlSuggestion] = useState(null);
    const [mlLoading, setMlLoading] = useState(false);
    const [mlError, setMlError] = useState(null);
    const [mlComplexity, setMlComplexity] = useState('medium');

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
            setServices(data.results || data);
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
        setConfirmDialog({
            open: true,
            title: t('servicesPage.deleteTitle'),
            message: t('servicesPage.deleteConfirm'),
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await deleteService(id);
                    fetchServices();
                } catch (e) {
                    console.error(e);
                }
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleApplyAIPrice = (price) => {
        setFormData({ ...formData, base_price: price.toString() });
        setIsAIModalOpen(false);
    };

    const handleGetMLSuggestion = async () => {
        setMlLoading(true);
        setMlError(null);
        setMlSuggestion(null);
        try {
            const data = await getPricingRecommendation(formData.category, mlComplexity);
            setMlSuggestion(data);
        } catch (err) {
            setMlError(err.message || 'Gagal mendapatkan saran harga');
        } finally {
            setMlLoading(false);
        }
    };

    const handleUseOptimalPrice = () => {
        if (mlSuggestion?.optimal_price) {
            setFormData(prev => ({ ...prev, base_price: mlSuggestion.optimal_price.toString() }));
            setMlSuggestion(null);
        }
    };

    if (loading) return <div className="p-8">Memuat jasa...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('servicesPage.title')}</h1>
                    <p className={styles.subtitle}>{t('servicesPage.subtitle')}</p>
                </div>
                <button onClick={openAddModal} className={styles.addBtn}>
                    <Plus size={20} /> {t('servicesPage.addService')}
                </button>
            </div>

            {services.length === 0 ? (
                <div className={styles.emptyState}>
                    <Briefcase size={48} className={styles.emptyIcon} />
                    <h3>{t('servicesPage.noServices')}</h3>
                    <p>{t('servicesPage.noServicesDesc')}</p>
                    <button onClick={openAddModal} className={styles.addBtnOutline}>+ {t('servicesPage.addService')}</button>
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
                            <h2 className={styles.modalTitle}>{editingId ? t('servicesPage.editService') : t('servicesPage.newService')}</h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>{t('servicesPage.serviceTitle')}</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className={styles.input}
                                    placeholder={t('servicesPage.serviceTitlePh')}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t('servicesPage.category')}</label>
                                <select
                                    value={formData.category}
                                    onChange={e => {
                                        setFormData({ ...formData, category: e.target.value });
                                        setMlSuggestion(null);
                                    }}
                                    className={styles.input}
                                >
                                    <option value="logo">{t('servicesPage.cat_logo')}</option>
                                    <option value="branding">{t('servicesPage.cat_branding')}</option>
                                    <option value="social_media">{t('servicesPage.cat_social_media')}</option>
                                    <option value="illustration">{t('servicesPage.cat_illustration')}</option>
                                    <option value="photo_product">{t('servicesPage.cat_photo_product')}</option>
                                    <option value="photo_event">{t('servicesPage.cat_photo_event')}</option>
                                    <option value="video_promo">{t('servicesPage.cat_video_promo')}</option>
                                    <option value="video_event">{t('servicesPage.cat_video_event')}</option>
                                    <option value="copywriting">{t('servicesPage.cat_copywriting')}</option>
                                    <option value="translation">{t('servicesPage.cat_translation')}</option>
                                    <option value="music">{t('servicesPage.cat_music')}</option>
                                    <option value="web_dev">{t('servicesPage.cat_web_dev')}</option>
                                    <option value="other">{t('servicesPage.cat_other')}</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t('servicesPage.detailDesc')}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className={styles.input}
                                    placeholder={t('servicesPage.detailDescPh')}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.priceLabelRow}>
                                    <span>{t('servicesPage.basePrice')}</span>
                                    <button type="button" onClick={() => setIsAIModalOpen(true)} className={styles.aiBtn}>
                                        <Briefcase size={16} style={{ marginRight: '8px' }} /> {t('servicesPage.checkAIPrice')}
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

                            {/* ML Pricing Suggestion */}
                            <div className={styles.mlPricingHelper}>
                                <div className={styles.mlPricingRow}>
                                    <div className={styles.mlComplexitySelect}>
                                        <label className={styles.mlComplexityLabel}>{t('servicesPage.complexity')}</label>
                                        <select
                                            value={mlComplexity}
                                            onChange={e => { setMlComplexity(e.target.value); setMlSuggestion(null); }}
                                            className={styles.mlComplexityInput}
                                        >
                                            <option value="simple">{t('servicesPage.comp_simple')}</option>
                                            <option value="medium">{t('servicesPage.comp_medium')}</option>
                                            <option value="complex">{t('servicesPage.comp_complex')}</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGetMLSuggestion}
                                        disabled={mlLoading}
                                        className={styles.mlSuggestBtn}
                                    >
                                        {mlLoading ? (
                                            <><Loader2 size={14} className={styles.spin} /> {t('servicesPage.loading')}</>
                                        ) : (
                                            <><Brain size={14} /> {t('servicesPage.marketPriceSuggestion')}</>
                                        )}
                                    </button>
                                </div>

                                {mlError && (
                                    <p className={styles.mlError}>{mlError}</p>
                                )}

                                {mlSuggestion && (
                                    <div className={styles.mlSuggestionBox}>
                                        <div className={styles.mlPriceRange}>
                                            <div className={styles.mlPriceItem}>
                                                <span className={styles.mlPriceItemLabel}>{t('servicesPage.min')}</span>
                                                <span className={styles.mlPriceItemValue}>{formatCurrency(mlSuggestion.min_price)}</span>
                                            </div>
                                            <div className={`${styles.mlPriceItem} ${styles.mlPriceItemOptimal}`}>
                                                <span className={styles.mlPriceItemLabel}>{t('servicesPage.optimal')}</span>
                                                <span className={styles.mlPriceItemValueOptimal}>{formatCurrency(mlSuggestion.optimal_price)}</span>
                                            </div>
                                            <div className={styles.mlPriceItem}>
                                                <span className={styles.mlPriceItemLabel}>{t('servicesPage.max')}</span>
                                                <span className={styles.mlPriceItemValue}>{formatCurrency(mlSuggestion.max_price)}</span>
                                            </div>
                                        </div>
                                        <p className={styles.mlSampleNote}>
                                            {t('servicesPage.basedOn')} {mlSuggestion.sample_size} {t('servicesPage.marketData')} &bull; {t('servicesPage.level')} {mlSuggestion.experience_level}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleUseOptimalPrice}
                                            className={styles.mlApplyBtn}
                                        >
                                            Gunakan Harga Optimal
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>{t('servicesPage.cancel')}</button>
                                <button type="submit" className={styles.saveBtn}>{t('servicesPage.saveService')}</button>
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

            <ConfirmDialog
                isOpen={confirmDialog.open}
                onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
            />
        </div>
    );
}


