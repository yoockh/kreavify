'use client';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '@/components/PublicNavbar';
import styles from './page.module.css';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/mjgenpob", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                setSubmitted(true);
                form.reset();
            } else {
                alert("Gagal mengirim pesan.");
            }
        } catch (error) {
            alert("Terjadi kesalahan.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <PublicNavbar />

            <div className={styles.contactWrapper}>
                <div className={styles.contactCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.mailIcon}><Mail size={28} /></div>
                        <h1 className={styles.cardTitle}>Hubungi Kami</h1>
                        <p className={styles.cardSubtitle}>Kirimkan pertanyaan, kritik, atau saran untuk tim Kreavify. Kami biasanya merespons dalam 1×24 jam.</p>
                    </div>

                    {submitted ? (
                        <div className={styles.successState}>
                            <CheckCircle size={56} color="#10b981" />
                            <h2>Pesan Terkirim!</h2>
                            <p>Terima kasih telah menghubungi kami. Tim kami akan membalas via email secepatnya.</p>
                            <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>Kirim Pesan Lain</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Nama Lengkap</label>
                                <input name="name" type="text" required placeholder="Budi Santoso" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Alamat Email</label>
                                <input name="email" type="email" required placeholder="budi@example.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Subjek</label>
                                <select name="subject">
                                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                                    <option value="Bug / Masalah Teknis">Bug / Masalah Teknis</option>
                                    <option value="Request Fitur">Request Fitur</option>
                                    <option value="Kerjasama / Bisnis">Kerjasama / Bisnis</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pesan</label>
                                <textarea name="message" required rows="5" placeholder="Tuliskan pesanmu secara detail agar kami dapat membantu lebih cepat..." />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                <Send size={16} /> Kirim Pesan
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
