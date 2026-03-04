'use client';

import { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile, uploadImage } from '@/lib/api';
import { Camera, Upload } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
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
                setMsg({ type: 'success', text: 'Foto profil berhasil diupload' });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: err.error || 'Gagal upload foto' });
            }
        } catch (e) {
            setMsg({ type: 'error', text: 'Gagal upload foto' });
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
                setMsg({ type: 'success', text: 'Banner berhasil diupload' });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: err.error || 'Gagal upload banner' });
            }
        } catch (e) {
            setMsg({ type: 'error', text: 'Gagal upload banner' });
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
                setMsg({ type: 'success', text: 'Profil berhasil diperbarui' });
            } else {
                const err = await res.json();
                setMsg({ type: 'error', text: Object.values(err)[0] || 'Gagal menyimpan profil' });
            }
        } catch (e) {
            setMsg({ type: 'error', text: 'Terjadi kesalahan' });
        }
        setSaving(false);
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat profil...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pengaturan Profil</h1>
                <p className={styles.subtitle}>Atur informasi publik dan metode pencairan dana</p>
            </div>

            {/* Banner Upload */}
            <div className={styles.bannerSection}>
                <div
                    className={styles.bannerPreview}
                    style={profile.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : {}}
                >
                    <button
                        type="button"
                        className={styles.bannerUploadBtn}
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={uploadingBanner}
                    >
                        <Upload size={16} /> {uploadingBanner ? 'Mengupload...' : 'Ganti Banner'}
                    </button>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        style={{ display: 'none' }}
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
                    <h2 className={styles.sectionTitle}>Info Dasar</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Nama Display</label>
                            <input type="text" name="display_name" value={profile.display_name} onChange={handleChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Profesi Utama</label>
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
                        <label>Bio Singkat</label>
                        <textarea name="bio" value={profile.bio} onChange={handleChange} rows="3" className={styles.textarea}></textarea>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>No. WhatsApp</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Slug URL (/p/{profile.slug})</label>
                            <input type="text" name="slug" value={profile.slug} disabled className={styles.input} style={{ opacity: 0.6 }} />
                            <small className={styles.helpText}>URL Profil Publik kamu: <a href={`/p/${profile.slug}`} target="_blank" style={{ color: 'var(--primary)' }}>/p/{profile.slug}</a></small>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Info Rekening Bank (Untuk Pencairan)</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Bank / e-Wallet</label>
                            <select name="bank_name" value={profile.bank_name} onChange={handleChange} className={styles.input}>
                                <option value="">Pilih Bank</option>
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
                            <label>Nomor Rekening</label>
                            <input type="text" name="bank_account_number" value={profile.bank_account_number} onChange={handleChange} className={styles.input} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nama Pemilik Rekening</label>
                        <input type="text" name="bank_account_name" value={profile.bank_account_name} onChange={handleChange} className={styles.input} />
                    </div>
                </div>

                {/* Branded Invoice Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Branded Invoice</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Kustomisasi tampilan invoice kamu agar terlihat lebih profesional</p>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Logo Invoice</label>
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
                                    <Upload size={16} /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Warna Aksen Invoice</label>
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
