'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { login } from '@/lib/api';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
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
                Cookies.set('access_token', data.access, { expires: 1 }); // 1 day expire
                Cookies.set('refresh_token', data.refresh, { expires: 30 }); // 30 days
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
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Masuk ke KaryaKita</h1>
                <p className={styles.subtitle}>Selamat datang kembali, kreator!</p>

                <form onSubmit={handleSubmit}>
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
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            required
                            className={styles.input}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
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
    );
}
