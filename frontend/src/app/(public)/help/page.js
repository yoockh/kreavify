export default function HelpPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Pusat Bantuan</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '3rem' }}>
                Temukan jawaban untuk pertanyaan yang paling sering diajukan oleh pengguna Kreavify.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', background: 'var(--white)' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Bagaimana cara membuat invoice baru?</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>Masuk ke menu Invoice di dashboard, klik tombol "Buat Invoice Baru", isi data klien dan layanan, lalu klik "Simpan" atau "Kirim". Kamu bisa mendownload PDF atau membagikan link langsung ke klien.</p>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', background: 'var(--white)' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Bagaimana cara membagikan profil ke publik?</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>Di menu Pengaturan, kamu dapat mengatur URL (slug) unik kamu. Bagikan link tersebut (misal: p/johndoe) ke klien agar mereka bisa melihat portfolio dan jasa kamu secara profesional.</p>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', background: 'var(--white)' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Bagaimana sistem pembayaran AI Pricing bekerja?</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>AI Pricing kami menganalisis ratusan data pasar lokal (Indonesia) untuk memperkirakan harga wajar jasa yang kamu definisikan, berdasarkan segmen pasar (UMKM/Startup) dan tingkat kompleksitas.</p>
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Masih butuh bantuan spesifik?</p>
                <a href="/contact" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Hubungi Tim Support Kami &rarr;</a>
            </div>
        </div>
    );
}
