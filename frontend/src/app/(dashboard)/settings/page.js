'use client';
import { useState } from 'react';
import { Globe, MapPin, Search, Send, FileText, HelpCircle, Info, Mail } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';

export default function SettingsPage() {
    const [localization, setLocalization] = useState({
        language: 'id',
        country: 'Indonesia',
        address: ''
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pengaturan Umum</h1>
                <p className={styles.subtitle}>Kelola preferensi bahasa, domisili, dan temukan bantuan</p>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Localization */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        <Globe size={18} /> Lokalisasi & Wilayah
                    </h2>
                    <p className={styles.cardSubtitle}>Pengaturan ini mempengaruhi mata uang default dan kalkulasi perpajakan (mendatang).</p>

                    <div className={styles.formGroup}>
                        <label>Bahasa Antarmuka</label>
                        <select
                            value={localization.language}
                            onChange={e => setLocalization({ ...localization, language: e.target.value })}
                            className={styles.input}
                        >
                            <option value="id">Bahasa Indonesia (Default)</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Negara Domisili</label>
                        <select
                            value={localization.country}
                            onChange={e => setLocalization({ ...localization, country: e.target.value })}
                            className={styles.input}
                        >
                            <option value="Indonesia">Indonesia</option>
                            <option value="Singapura">Singapura</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Amerika Serikat">Amerika Serikat</option>
                            <option value="Australia">Australia</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Alamat Lengkap</label>
                        <textarea
                            value={localization.address}
                            onChange={e => setLocalization({ ...localization, address: e.target.value })}
                            className={styles.input}
                            rows="3"
                            placeholder="Jl. Sudirman No 123..."
                        />
                    </div>

                    <div className={styles.actions}>
                        {saved && <span className={styles.successText}>Pengaturan disimpan!</span>}
                        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Help & Support */}
                <div className={styles.sideCol}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <HelpCircle size={18} /> Bantuan & Dukungan
                        </h2>

                        <div className={styles.linkList}>
                            <Link href="/help" className={styles.linkItem}>
                                <FileText size={18} />
                                <div>
                                    <strong>Pusat Bantuan</strong>
                                    <span>Panduan menggunakan Kreavify</span>
                                </div>
                            </Link>

                            <Link href="/contact" className={styles.linkItem}>
                                <Mail size={18} />
                                <div>
                                    <strong>Hubungi Kami</strong>
                                    <span>Punya kendala? Kirim pesan ke tim kami</span>
                                </div>
                            </Link>

                            <Link href="/about" className={styles.linkItem}>
                                <Info size={18} />
                                <div>
                                    <strong>Tentang Kreavify</strong>
                                    <span>Pelajari misi dan visi kami</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Profil Publik</h2>
                        <p className={styles.cardSubtitle}>Ingin mengubah warna & tampilan profil publik (portofolio) kamu?</p>
                        <Link href="/profile" className={styles.secondaryBtn}>
                            Edit Profil Publik
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
