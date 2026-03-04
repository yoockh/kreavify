import Link from 'next/link';
import styles from '../terms/page.module.css'; // sharing styles

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>&larr; Kembali ke Beranda</Link>
                <h1 className={styles.title}>Kebijakan Privasi (Privacy Policy)</h1>
                <p className={styles.lastUpdated}>Terakhir Diperbarui: 4 Maret 2026</p>

                <section className={styles.section}>
                    <h2>1. Pengumpulan Data</h2>
                    <p>
                        Saat Anda menggunakan Kreavify, kami dapat mengumpulkan data pribadi termasuk namun tidak terbatas pada:
                        Nama, alamat email, nomor telepon, informasi rekening bank untuk tujuan pencairan dana, dan riwayat transaksi.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Penggunaan Informasi</h2>
                    <p>Data yang kami kumpulkan digunakan untuk:</p>
                    <ul>
                        <li>Memfasilitasi pembuatan profil publik dan tagihan invoice Anda.</li>
                        <li>Memproses pencairan dana melalui partner Payment Gateway.</li>
                        <li>Mencegah penipuan (fraud), spam, dan aktivitas ilegal dengan algoritma keamanan.</li>
                        <li>Mengirimkan notifikasi tagihan atau pembaruan layanan teknis.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. Pembagian Data ke Pihak Ketiga</h2>
                    <p>
                        Kami sangat menghargai privasi Anda. Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga.
                        Data hanya akan diteruskan ke mitra resmi (seperti Midtrans) dengan tujuan semata-mata memproses pembayaran dan
                        memenuhi regulasi sistem keuangan di bawah naungan Bank Indonesia.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Keamanan Data</h2>
                    <p>
                        Kreavify menggunakan langkah-langkah enkripsi tingkat industri (termasuk SSL/TLS) untuk melindungi transmisi
                        data antara peramban Anda dan server kami. Token kredensial dikelola dan disimpan secara aman.
                    </p>
                </section>
            </div>
        </div>
    );
}
