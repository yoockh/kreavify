'use client';

import { useI18n } from '@/lib/i18n';
import { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile, uploadImage } from '@/lib/api';
import { Camera, Upload } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
    const { t } = useI18n();
    const [profile, setProfile] = useState({
        display_name: '',
        bio: '',
        profession: 'designer',
        phone: '',
        avatar_url: '',
        banner_url: '',
        slug: '',
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
        invoice_logo_url: '',
        invoice_accent_color: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        if (msg.text) {
            const timer = setTimeout(() => {
                setMsg({ type: '', text: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [msg.text]);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const logoInputRef = useRef(null);

    useEffect(() => {
        getProfile()
            .then(res => res.json())
            .then(data => {
                setProfile({
                    display_name: data.display_name || '',
                    bio: data.bio || '',
                    profession: data.profession || 'designer',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || '',
                    banner_url: data.banner_url || '',
                    slug: data.slug || '',
                    bank_name: data.bank_name || '',
                    bank_account_number: data.bank_account_number || '',
                    bank_account_name: data.bank_account_name || '',
                    invoice_logo_url: data.invoice_logo_url || '',
                    invoice_accent_color: data.invoice_accent_color || '',
                });
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingAvatar(true);
        try {
            const res = await uploadImage(file, 'avatars');
            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, avatar_url: data.url }));
                setMsg({ type: 'success', text: t('profilePage.avatarSuccess') });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: err.error || t('profilePage.avatarFail') });
            }
        } catch (e) {
            setMsg({ type: 'error', text: t('profilePage.avatarFail') });
        }
        setUploadingAvatar(false);
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingBanner(true);
        try {
            const res = await uploadImage(file, 'banners');
            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, banner_url: data.url }));
                setMsg({ type: 'success', text: t('profilePage.bannerSuccess') });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: err.error || t('profilePage.bannerFail') });
            }
        } catch (e) {
            setMsg({ type: 'error', text: t('profilePage.bannerFail') });
        }
        setUploadingBanner(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: '', text: '' });
        try {
            const res = await updateProfile(profile);
            if (res.ok) {
                setMsg({ type: 'success', text: t('profilePage.profileOk') });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: Object.values(err)[0] || t('profilePage.profileFail') });
            }
        } catch (e) {
            setMsg({ type: 'error', text: t('profilePage.errorGeneric') });
        }
        setSaving(false);
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>{t('profilePage.loading')}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('profilePage.title')}</h1>
                <p className={styles.subtitle}>{t('profilePage.subtitle')}</p>
            </div>

            {/* Banner Upload */}
            <div className={styles.bannerSection}>
                <div
                    className={styles.bannerPreview}
                    style={profile.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : {}}
                >
                    <label
                        htmlFor="banner-upload"
                        className={styles.bannerUploadBtn}
                        style={{ cursor: uploadingBanner ? 'not-allowed' : 'pointer', opacity: uploadingBanner ? 0.7 : 1 }}
                    >
                        <Upload size={16} /> {uploadingBanner ? t('profilePage.uploading') : t('profilePage.changeBanner')}
                    </label>
                    <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingBanner}
                    />
                </div>

                {/* Avatar Upload (overlapping banner) */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {profile.display_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                        <button
                            type="button"
                            className={styles.avatarUploadBtn}
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={uploadingAvatar}
                        >
                            <Camera size={14} />
                        </button>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                {msg.text && (
                    <div className={`${styles.alert} ${styles[msg.type]}`}>{msg.text}</div>
                )}

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('profilePage.basicInfo')}</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.displayName')}</label>
                            <input type="text" name="display_name" value={profile.display_name} onChange={handleChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.primaryProfession')}</label>
                            <select name="profession" value={profile.profession} onChange={handleChange} className={styles.input}>
                                <option value="designer">Desainer Grafis</option>
                                <option value="photographer">Fotografer</option>
                                <option value="videographer">Videografer</option>
                                <option value="writer">Penulis/Copywriter</option>
                                <option value="musician">Musisi/Sound Engineer</option>
                                <option value="developer">Developer/Programmer</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>{t('profilePage.shortBio')}</label>
                        <textarea name="bio" value={profile.bio} onChange={handleChange} rows="3" className={styles.textarea}></textarea>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.whatsappNo')}</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.slugUrl')} (/p/{profile.slug})</label>
                            <input type="text" name="slug" value={profile.slug} disabled className={styles.input} style={{ opacity: 0.6 }} />
                            <small className={styles.helpText}>{t('profilePage.publicProfileUrl')} <a href={`/p/${profile.slug}`} target="_blank" style={{ color: 'var(--primary)' }}>/p/{profile.slug}</a></small>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('profilePage.bankInfo')}</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.bankOrEwallet')}</label>
                            <select name="bank_name" value={profile.bank_name} onChange={handleChange} className={styles.input}>
                                <option value="">{t('profilePage.selectBank')}</option>
                                <option value="BCA">BCA</option>
                                <option value="BNI">BNI</option>
                                <option value="BRI">BRI</option>
                                <option value="Mandiri">Mandiri</option>
                                <option value="BSI">BSI</option>
                                <option value="CIMB">CIMB Niaga</option>
                                <option value="Permata">Permata</option>
                                <option value="Jenius">Jenius</option>
                                <option value="GoPay">GoPay</option>
                                <option value="OVO">OVO</option>
                                <option value="Dana">DANA</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.accountNumber')}</label>
                            <input type="text" name="bank_account_number" value={profile.bank_account_number} onChange={handleChange} className={styles.input} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>{t('profilePage.accountName')}</label>
                        <input type="text" name="bank_account_name" value={profile.bank_account_name} onChange={handleChange} className={styles.input} />
                    </div>
                </div>

                {/* Branded Invoice Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('profilePage.brandedInvoice')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{t('profilePage.customizeInvoice')}</p>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.invoiceLogo')}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {profile.invoice_logo_url && (
                                    <img src={profile.invoice_logo_url} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
                                )}
                                <input type="file" ref={logoInputRef} accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setUploadingLogo(true);
                                    try {
                                        const res = await uploadImage(file, 'logos');
                                        if (res.ok) {
                                            const data = await res.json();
                                            setProfile(prev => ({ ...prev, invoice_logo_url: data.url }));
                                        }
                                    } catch (err) { console.error(err); }
                                    setUploadingLogo(false);
                                }} />
                                <button type="button" onClick={() => logoInputRef.current?.click()} className={styles.uploadBtn} disabled={uploadingLogo}>
                                    <Upload size={16} /> {uploadingLogo ? t('profilePage.uploading') : t('profilePage.uploadLogo')}
                                </button>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profilePage.invoiceAccentColor')}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input
                                    type="color"
                                    name="invoice_accent_color"
                                    value={profile.invoice_accent_color || '#2563eb'}
                                    onChange={handleChange}
                                    style={{ width: 48, height: 40, border: '1px solid var(--border-color)', borderRadius: '0.375rem', cursor: 'pointer', padding: 2 }}
                                />
                                <input
                                    type="text"
                                    name="invoice_accent_color"
                                    value={profile.invoice_accent_color}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="#2563eb"
                                    style={{ maxWidth: 120 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
