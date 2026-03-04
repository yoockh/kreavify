'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/api';
import styles from './page.module.css';

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        display_name: '',
        bio: '',
        profession: 'designer',
        phone: '',
        avatar_url: '',
        slug: '',
        bank_name: '',
        bank_account_number: '',
        bank_account_name: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

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
                    slug: data.slug || '',
                    bank_name: data.bank_name || '',
                    bank_account_number: data.bank_account_number || '',
                    bank_account_name: data.bank_account_name || ''
                });
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

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

    if (loading) return <div className="p-8">Memuat profil...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pengaturan Profil</h1>
                <p className={styles.subtitle}>Atur informasi publik dan metode pencairan dana</p>
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
                            <label>Avatar URL (Opsional)</label>
                            <input type="url" name="avatar_url" value={profile.avatar_url} onChange={handleChange} className={styles.input} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Slug URL (/p/{profile.slug})</label>
                        <input type="text" name="slug" value={profile.slug} disabled className={styles.input} style={{ background: '#f3f4f6' }} />
                        <small className={styles.helpText}>URL Profil Publik kamu: <a href={`/p/${profile.slug}`} target="_blank" className="text-blue-500 hover:underline">/p/{profile.slug}</a></small>
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

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
