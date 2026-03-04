'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Eye, EyeOff, Check, X as XIcon } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { register, login } from '@/lib/api';
import styles from '../login/page.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        display_name: '',
        password: '',
        confirmPassword: '',
        profession: 'designer'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordRules = [
        { label: 'Min. 8 karakter', test: (p) => p.length >= 8 },
        { label: 'Huruf kapital', test: (p) => /[A-Z]/.test(p) },
        { label: 'Huruf kecil', test: (p) => /[a-z]/.test(p) },
        { label: 'Angka', test: (p) => /[0-9]/.test(p) },
        { label: 'Karakter spesial', test: (p) => /[^A-Za-z0-9]/.test(p) },
    ];

    const allRulesPassed = passwordRules.every(r => r.test(formData.password));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!allRulesPassed) {
            setError('Password belum memenuhi semua kriteria keamanan.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            setLoading(false);
            return;
        }

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
            const { confirmPassword, ...payload } = formData;
            const res = await register(payload);
            if (res.ok) {
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
                if (errData.password) message += ` Password: ${errData.password[0]}`;
                setError(message);
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftPanel}>
                <div className={styles.leftLogo}>Kreavify</div>
                <div className={styles.leftBody}>
                    <p className={styles.leftEyebrow}>Bergabung Sekarang</p>
                    <h2 className={styles.leftTitle}>Mulai Perjalanan<br />Kreatifmu<br />Tanpa Batas.</h2>
                    <p className={styles.leftSubtitle}>Akses semua fitur pengaturan invoice, portofolio profesional, dan pembayaran dalam 1 menit.</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Create an account</h1>
                    <p className={styles.subtitle}>Daftar untuk menjelajahi potensi penuh platform kami.</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Panggilan / Brand</label>
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
                                placeholder="email@contoh.com"
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
                                placeholder="username_unik"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value.replace(/\s+/g, '').toLowerCase() })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength="8"
                                    className={styles.input}
                                    placeholder="Buat password kuat"
                                    value={formData.password}
                                    onFocus={() => setPasswordTouched(true)}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className={styles.passwordRules}>
                                {passwordRules.map((rule, idx) => {
                                    const passed = rule.test(formData.password);
                                    let cls = styles.ruleDefault;
                                    if (passwordTouched) {
                                        cls = passed ? styles.rulePassed : styles.ruleFailed;
                                    }
                                    return (
                                        <span key={idx} className={`${styles.ruleItem} ${cls}`}>
                                            {passwordTouched ? (passed ? <Check size={12} /> : <XIcon size={12} />) : null}
                                            {rule.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Konfirmasi Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    minLength="8"
                                    className={styles.input}
                                    placeholder="Ulangi password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button type="button" className={styles.eyeToggle} onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.4rem' }}>Password tidak cocok</p>
                            )}
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.4rem' }}>Password cocok</p>
                            )}
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

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
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
        </div>
    );
}
