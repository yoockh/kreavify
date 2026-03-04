import Link from 'next/link';
import styles from './page.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>&larr; Kembali ke Beranda</Link>
                <h1 className={styles.title}>Syarat & Ketentuan (Terms of Service)</h1>
                <p className={styles.lastUpdated}>Terakhir Diperbarui: 4 Maret 2026</p>

                <section className={styles.section}>
                    <h2>1. Pendahuluan</h2>
                    <p>
                        Selamat datang di Kreavify. Dengan mendaftar dan menggunakan layanan Kreavify, Anda setuju untuk terikat
                        dengan Syarat dan Ketentuan berikut. Harap baca dengan saksama sebelum menggunakan platform kami.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Definisi Layanan</h2>
                    <p>
                        Kreavify adalah platform pembuatan invoice digital dan penerimaan pembayaran untuk pekerja lepas (freelancer)
                        dan pelaku usaha kreatif di Indonesia. Kami bukan bank, melainkan penyedia layanan teknologi yang bermitra dengan
                        Payment Gateway berlisensi (Midtrans) untuk memproses transaksi.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Akun Pengguna</h2>
                    <ul>
                        <li>Anda harus memberikan informasi yang akurat, lengkap, dan terbaru saat mendaftar.</li>
                        <li>Anda bertanggung jawab menjaga kerahasiaan kata sandi dan keamanan akun Anda.</li>
                        <li>Kreavify berhak menangguhkan atau menghapus akun yang diduga melakukan tindakan penipuan, spam, atau melanggar hukum.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Transaksi & Biaya</h2>
                    <p>
                        Setiap transaksi pembayaran yang berhasil melalui tautan Kreavify dapat dikenakan biaya pemrosesan standar dari
                        pihak ketiga (Payment Gateway). Kreavify tidak memotong saldo utama kecuali disebutkan secara tertulis pada halaman tagihan.
                        Proses pencairan dana mematuhi kebijakan SLA Payment Gateway.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Pembatasan Tanggung Jawab (Disclaimer)</h2>
                    <p>
                        Kreavify menyediakan platform secara "AS IS" (sebagaimana adanya). Kami tidak menjamin kelangsungan spesifik bisnis
                        Anda dan tidak bertanggung jawab atas sengketa antara kreator dan klien terkait kualitas produk/jasa yang ditagihkan melalui platform kami.
                    </p>
                </section>
            </div>
        </div>
    );
}
