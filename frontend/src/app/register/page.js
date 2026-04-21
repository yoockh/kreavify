'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Eye, EyeOff, Check, X as XIcon } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { register, login } from '@/lib/api';
import styles from '../login/page.module.css';
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
    const router = useRouter();
    const { t, locale } = useI18n();
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
        { label: t('auth.register.passwordRules.min8'), test: (p) => p.length >= 8 },
        { label: t('auth.register.passwordRules.upper'), test: (p) => /[A-Z]/.test(p) },
        { label: t('auth.register.passwordRules.lower'), test: (p) => /[a-z]/.test(p) },
        { label: t('auth.register.passwordRules.number'), test: (p) => /[0-9]/.test(p) },
        { label: t('auth.register.passwordRules.special'), test: (p) => /[^A-Za-z0-9]/.test(p) },
    ];

    const allRulesPassed = passwordRules.every(r => r.test(formData.password));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!allRulesPassed) {
            setError(t('auth.register.passwordRulesError'));
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.passwordMismatch'));
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError(t('auth.register.termsRequired'));
            setLoading(false);
            return;
        }

        if (!recaptchaToken) {
            setError(t('auth.register.recaptchaRequired'));
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
            setError(t('auth.register.connectionError'));
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
                        src="/Creative.lottie"
                        loop
                        autoplay
                        style={{ width: '100%', height: 540 }}
                    />
                </div>
                <div className={styles.leftBody} style={{ marginBottom: '1rem' }}>
                    <p className={styles.leftEyebrow}>{t('auth.register.leftEyebrow')}</p>
                    <h2 className={styles.leftTitle}>
                        {t('auth.register.leftTitleLine1')}<br />
                        {t('auth.register.leftTitleLine2')}<br />
                        {t('auth.register.leftTitleLine3')}
                    </h2>
                    <p className={styles.leftSubtitle}>{t('auth.register.leftSubtitle')}</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>{t('auth.register.title')}</h1>
                    <p className={styles.subtitle}>{t('auth.register.subtitle')}</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('auth.register.displayName')}</label>
                            <input
                                type="text"
                                required
                                placeholder={t('auth.register.displayNamePlaceholder')}
                                className={styles.input}
                                value={formData.display_name}
                                onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('auth.register.profession')}</label>
                            <select
                                className={styles.input}
                                value={formData.profession}
                                onChange={e => setFormData({ ...formData, profession: e.target.value })}
                            >
                                <option value="designer">{t('auth.register.professionOptions.designer')}</option>
                                <option value="photographer">{t('auth.register.professionOptions.photographer')}</option>
                                <option value="videographer">{t('auth.register.professionOptions.videographer')}</option>
                                <option value="writer">{t('auth.register.professionOptions.writer')}</option>
                                <option value="musician">{t('auth.register.professionOptions.musician')}</option>
                                <option value="developer">{t('auth.register.professionOptions.developer')}</option>
                                <option value="other">{t('auth.register.professionOptions.other')}</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('auth.register.email')}</label>
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
                            <label className={styles.label}>{t('auth.register.username')}</label>
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
                            <label className={styles.label}>{t('auth.register.password')}</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength="8"
                                    className={styles.input}
                                    placeholder={t('auth.register.passwordPlaceholder')}
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
                            <label className={styles.label}>{t('auth.register.confirmPassword')}</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    minLength="8"
                                    className={styles.input}
                                    placeholder={t('auth.register.confirmPassword')}
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button type="button" className={styles.eyeToggle} onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.4rem' }}>{t('auth.register.passwordNoMatch')}</p>
                            )}
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.4rem' }}>{t('auth.register.passwordMatch')}</p>
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
                                    {t('auth.register.termsAgreementPrefix')} <Link href="/terms" target="_blank" className={styles.link}>{t('auth.register.terms')}</Link> {t('auth.register.and')} <Link href="/privacy" target="_blank" className={styles.link}>{t('auth.register.privacy')}</Link>
                                </span>
                            </label>
                        </div>

                        <div className={styles.recaptchaWrapper}>
                            <ReCAPTCHA
                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                onChange={(token) => setRecaptchaToken(token)}
                            />
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        {t('auth.register.haveAccount')} <Link href="/login" className={styles.link}>{t('auth.register.loginLink')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
