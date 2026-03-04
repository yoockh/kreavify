'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { register, login } from '@/lib/api';
import styles from '../login/page.module.css'; // Reuse login styles

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        display_name: '',
        password: '',
        profession: 'designer'
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!agreedToTerms) {
            setError('Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.');
            setLoading(false);
            return;
        }

        if (!recaptchaToken) {
            setError('Selesaikan verifikasi reCAPTCHA terlebih dahulu.');
            setLoading(false);
            return;
        }

        try {
            const res = await register(formData);
            if (res.ok) {
                // Auto login
                const loginRes = await login(formData.email, formData.password);
                if (loginRes.ok) {
                    const authData = await loginRes.json();
                    Cookies.set('access_token', authData.access, { expires: 1 });
                    Cookies.set('refresh_token', authData.refresh, { expires: 30 });
                    router.push('/dashboard');
                } else {
                    router.push('/login');
                }
            } else {
                const errData = await res.json();
                let message = 'Registrasi gagal.';
                if (errData.email) message += ` Email: ${errData.email[0]}`;
                if (errData.username) message += ` Username: ${errData.username[0]}`;
                setError(message);
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Daftar Kreavify</h1>
                <p className={styles.subtitle}>Mulai digitalkan jasa kamu dalam hitungan menit.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nama Panggilan/Brand</label>
                        <input
                            type="text"
                            required
                            placeholder="Misal: Budi Design"
                            className={styles.input}
                            value={formData.display_name}
                            onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Profesi Utama</label>
                        <select
                            className={styles.input}
                            value={formData.profession}
                            onChange={e => setFormData({ ...formData, profession: e.target.value })}
                        >
                            <option value="designer">Desainer Grafis</option>
                            <option value="photographer">Fotografer</option>
                            <option value="videographer">Videografer</option>
                            <option value="writer">Penulis/Copywriter</option>
                            <option value="musician">Musisi/Sound Engineer</option>
                            <option value="developer">Developer/Programmer</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            required
                            className={styles.input}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            required
                            className={styles.input}
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value.replace(/\s+/g, '').toLowerCase() })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            required
                            minLength="8"
                            className={styles.input}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                required
                                checked={agreedToTerms}
                                onChange={e => setAgreedToTerms(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>
                                Saya setuju dengan <Link href="/terms" target="_blank" className={styles.link}>Syarat & Ketentuan</Link> dan <Link href="/privacy" target="_blank" className={styles.link}>Kebijakan Privasi</Link>
                            </span>
                        </label>
                    </div>

                    <div className={styles.formGroup} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={(token) => setRecaptchaToken(token)}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Sudah punya akun? <Link href="/login" className={styles.link}>Masuk di sini</Link>
                </div>
            </div>
        </div>
    );
}
