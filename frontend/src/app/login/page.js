'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(formData.email, formData.password);
            if (res.ok) {
                const data = await res.json();
                Cookies.set('access_token', data.access, { expires: 1 });
                Cookies.set('refresh_token', data.refresh, { expires: 30 });
                router.push('/dashboard');
            } else {
                const errData = await res.json();
                setError(errData.detail || 'Login gagal. Periksa email & password kamu.');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftPanel}>
                <div className={styles.leftLogo}>Kreavify</div>
                <div className={styles.leftBody}>
                    <p className={styles.leftEyebrow}>Akses Mudah</p>
                    <h2 className={styles.leftTitle}>Satu Platform<br />Untuk Bisnis<br />Kreatifmu.</h2>
                    <p className={styles.leftSubtitle}>Kelola invoice, pamerkan portofolio, dan terima pembayaran klien dengan mulus di satu tempat.</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Masuk ke akun Kreavify-mu untuk melanjutkan produktivitas.</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                required
                                className={styles.input}
                                placeholder="email@contoh.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className={styles.input}
                                    placeholder="Masukkan password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Masuk...' : 'Masuk'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Belum punya akun? <Link href="/register" className={styles.link}>Daftar di sini</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
