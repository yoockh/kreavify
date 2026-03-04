import PublicNavbar from '@/components/PublicNavbar';
import styles from './page.module.css';
import { Rocket, FileText, Image, ScrollText, Bot, BarChart2, MessageCircle } from 'lucide-react';

export const metadata = {
    title: 'Pusat Bantuan — Kreavify',
    description: 'Panduan lengkap menggunakan Kreavify untuk freelancer Indonesia'
};

const faqs = [
    {
        category: 'Memulai',
        Icon: Rocket,
        items: [
            {
                q: 'Apa itu Kreavify?',
                a: 'Kreavify adalah platform manajemen bisnis freelance all-in-one yang dirancang untuk kreator Indonesia. Kelola invoice, kontrak, portfolio, dan analitik bisnis kamu dalam satu dasbor yang elegan.'
            },
            {
                q: 'Bagaimana cara membuat akun?',
                a: 'Klik tombol "Daftar Gratis" di pojok kanan atas, isi nama, email, dan password, lalu verifikasi email kamu. Proses pendaftaran selesai dalam kurang dari 2 menit.'
            },
            {
                q: 'Apakah Kreavify gratis?',
                a: 'Ya! Paket Basic Kreavify sepenuhnya gratis tanpa batas waktu. Kamu bisa membuat hingga 5 invoice dan 10 portfolio items. Upgrade ke Premium atau Pro untuk limit tak terbatas dan fitur-fitur lanjutan.'
            }
        ]
    },
    {
        category: 'Invoice & Pembayaran',
        Icon: FileText,
        items: [
            {
                q: 'Bagaimana cara membuat invoice baru?',
                a: 'Masuk ke menu "Invoice" → klik tombol "+ Buat Invoice" → isi data klien dan item layanan yang kamu berikan → klik "Simpan" atau langsung "Kirim ke Klien". Kamu bisa mendownload PDF atau membagikan link pembayaran langsung.'
            },
            {
                q: 'Apakah klien perlu akun Kreavify untuk membayar?',
                a: 'Tidak perlu! Klien bisa mengakses link invoice yang kamu kirimkan langsung, tanpa perlu mendaftar. Link berisi detail invoice dan instruksi pembayaran.'
            },
            {
                q: 'Bagaimana mengirim reminder pembayaran otomatis?',
                a: 'Buka invoice yang statusnya "Menunggu Pembayaran", klik tombol "Kirim Reminder via WhatsApp". Sistem akan mengirimkan pesan WhatsApp otomatis ke nomor klien.'
            },
            {
                q: 'Apa itu nomor invoice dan bagaimana formatnya?',
                a: 'Nomor invoice dibuat otomatis dalam format KK-[TAHUN]-[NOMOR]. Contoh: KK-2025-0001. Kamu tidak perlu khawatir tentang duplikasi nomor; sistem sudah menanganinya secara otomatis.'
            }
        ]
    },
    {
        category: 'Profil & Portfolio',
        Icon: Image,
        items: [
            {
                q: 'Bagaimana cara membagikan profil publik saya?',
                a: 'Profil publikmu otomatis tersedia di link /p/[username-kamu]. Kamu bisa menemukan dan membagikan link ini dari menu "Profil Publik" di sidebar atau dari halaman Pengaturan Profil.'
            },
            {
                q: 'Bagaimana menambah karya portfolio?',
                a: 'Buka menu "Portfolio" → klik "+ Tambah Karya" → isi judul, kategori, pilih gambar dari perangkatmu (atau paste link URL gambar) → klik Simpan. Karya akan langsung tampil di profil publikmu.'
            },
            {
                q: 'Kenapa foto banner saya tidak tersimpan?',
                a: 'Pastikan ukuran file tidak melebihi 5MB dan format gambarnya JPG/PNG/WebP. Setelah memilih file, tunggu hingga proses upload selesai (akan ada indikator "Mengupload..."), lalu klik "Simpan Perubahan".'
            }
        ]
    },
    {
        category: 'Kontrak Digital',
        Icon: ScrollText,
        items: [
            {
                q: 'Bagaimana cara membuat kontrak otomatis?',
                a: 'Dari menu "Kontrak" atau dari halaman detail Invoice, klik "Generate Kontrak". AI kami akan membuat draft kontrak profesional berdasarkan data invoice seperti nama klien, deskripsi pekerjaan, dan total nilai proyek.'
            },
            {
                q: 'Apakah kontrak digital saya memiliki kekuatan hukum?',
                a: 'Kontrak yang dibuat Kreavify berisi klausul standar yang merujuk pada hukum perjanjian Indonesia. Untuk proyek besar, kami sarankan konsultasi dengan notaris atau ahli hukum untuk kekuatan hukum yang lebih kuat.'
            }
        ]
    },
    {
        category: 'AI Pricing Assistant',
        Icon: Bot,
        items: [
            {
                q: 'Bagaimana AI Pricing Assistant bekerja?',
                a: 'AI kami menganalisis deskripsi jasa, segmen target pasar (UMKM/Startup/Korporat), dan tingkat kompleksitas pekerjaan untuk memberikan estimasi harga yang wajar dan kompetitif di pasar Indonesia dan sekitarnya.'
            },
            {
                q: 'Berapa batas penggunaan AI Pricing per bulan?',
                a: 'Paket Basic mendapat 3x penggunaan AI Pricing per bulan. Paket Premium mendapat 20x, dan Paket Pro mendapat penggunaan tak terbatas. Upgrade kapan saja dari halaman Upgrade Plan.'
            }
        ]
    },
    {
        category: 'Laporan Pajak',
        Icon: BarChart2,
        items: [
            {
                q: 'Bagaimana Kreavify menghitung perkiraan pajak saya?',
                a: 'Kreavify menghitung estimasi Pajak Penghasilan berdasarkan total pendapatan bruto tahun tersebut mengikuti PP 55/2022 untuk UMKM (tarif PPh Final 0.5%). Ini adalah estimasi; konsultasikan dengan konsultan pajak untuk perhitungan resmi.'
            },
            {
                q: 'Apakah laporan pajak saya akurat?',
                a: 'Laporan pajak di Kreavify dihitung berdasarkan invoice yang statusnya "Dibayar" saja. Pastikan semua pembayaran yang diterima sudah diubah statusnya menjadi "Dibayar" untuk laporan yang akurat.'
            }
        ]
    }
];

export default function HelpPage() {
    return (
        <>
            <PublicNavbar />
            <div className={styles.pageWrapper}>
                {/* Hero */}
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Pusat Bantuan</h1>
                        <p className={styles.heroSubtitle}>Temukan jawaban untuk semua pertanyaan seputar penggunaan Kreavify</p>
                    </div>
                </div>

                {/* FAQ */}
                <div className={styles.content}>
                    {faqs.map((section) => (
                        <section key={section.category} className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>
                                    <section.Icon size={18} />
                                </span>
                                {section.category}
                            </h2>
                            <div className={styles.faqList}>
                                {section.items.map((item, i) => (
                                    <div key={i} className={styles.faqItem}>
                                        <h3 className={styles.question}>{item.q}</h3>
                                        <p className={styles.answer}>{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className={styles.contactCta}>
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaIconWrap}>
                            <MessageCircle size={28} />
                        </div>
                        <h2>Masih ada pertanyaan lain?</h2>
                        <p>Tim kami siap membantu kamu melalui email. Kami biasanya merespons dalam 1×24 jam.</p>
                        <a href="/contact" className={styles.ctaBtn}>Hubungi Tim Kreavify</a>
                    </div>
                </div>
            </div>
        </>
    );
}
