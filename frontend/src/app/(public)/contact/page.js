'use client';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

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
                headers: {
                    'Accept': 'application/json'
                }
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
            <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>Kreavify</Link>
                <nav style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Tentang Kami</Link>
                    <Link href="/help" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Bantuan</Link>
                    <Link href="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Masuk</Link>
                </nav>
            </header>

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: 48, height: 48, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Mail size={24} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hubungi Kami</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Kirimkan pertanyaan, kritik, atau saran untuk tim Kreavify.</p>
                    </div>

                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pesan Terkirim!</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Terima kasih telah menghubungi kami. Tim kami akan membalas via email secepatnya.</p>
                            <button onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer' }}>Kirim Pesan Lain</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nama Lengkap</label>
                                <input name="name" type="text" required style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }} placeholder="Budi Santoso" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Alamat Email</label>
                                <input name="email" type="email" required style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }} placeholder="budi@example.com" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Pesan</label>
                                <textarea name="message" required rows="4" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', resize: 'vertical' }} placeholder="Tuliskan pesanmu secara detail..." />
                            </div>
                            <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                                <Send size={16} /> Kirim Pesan
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
