export default function AboutPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Tentang Kreavify</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Kreavify adalah platform manajemen klien dan invoice terbaik yang dirancang khusus untuk freelancer dan pekerja kreatif di Indonesia.
                Kami memahami betapa rumitnya mengelola dokumen, jadwal, hingga pembayaran, sehingga kami hadirkan solusi satu pintu yang praktis.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2.5rem', marginBottom: '1rem' }}>Misi Kami</h2>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Memberdayakan jutaan kreator independen dengan alat profesional untuk meningkatkan kredibilitas, memenangkan lebih banyak proyek, dan mendapatkan bayaran tepat waktu tanpa repot.
            </p>

            <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '1rem', marginTop: '3rem', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Bergabung dengan Kami?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tingkatkan karir freelance kamu ke level selanjutnya bersama Kreavify.</p>
                <a href="/login" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>Daftar Gratis Sekarang</a>
            </div>
        </div>
    );
}
