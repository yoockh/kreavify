'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { login } from '@/lib/api';
import styles from './page.module.css';
import { useI18n } from '@/lib/i18n';

export default function LoginPage() {
    const router = useRouter();
    const { t } = useI18n();
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
                setError(errData.detail || t('auth.login.errorInvalid'));
            }
        } catch (err) {
            setError(t('auth.login.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftPanel}>
                <div className={styles.leftLogo}>Kreavify</div>
                <div className={styles.lottieWrapper}>
                    <DotLottieReact
                        src="/Share.lottie"
                        loop
                        autoplay
                        style={{ width: '100%', height: 480 }}
                    />
                </div>
                <div className={styles.leftBody}>
                    <p className={styles.leftEyebrow}>{t('auth.login.leftEyebrow')}</p>
                    <h2 className={styles.leftTitle}>
                        {t('auth.login.leftTitleLine1')}<br />
                        {t('auth.login.leftTitleLine2')}<br />
                        {t('auth.login.leftTitleLine3')}
                    </h2>
                    <p className={styles.leftSubtitle}>{t('auth.login.leftSubtitle')}</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>{t('auth.login.title')}</h1>
                    <p className={styles.subtitle}>{t('auth.login.subtitle')}</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('auth.login.email')}</label>
                            <input
                                type="email"
                                required
                                className={styles.input}
                                placeholder={t('auth.login.emailPlaceholder')}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('auth.login.password')}</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className={styles.input}
                                    placeholder={t('auth.login.passwordPlaceholder')}
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
                            {loading ? t('auth.login.submitting') : t('auth.login.submit')}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        {t('auth.login.noAccount')} <Link href="/register" className={styles.link}>{t('auth.login.registerLink')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
