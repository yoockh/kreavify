import PublicNavbar from '@/components/PublicNavbar';
import styles from './page.module.css';
import Link from 'next/link';
import { Target, Eye, Lightbulb, FileText, ScrollText, Bot, BarChart2, LayoutDashboard, TrendingUp, MapPin } from 'lucide-react';

export const metadata = {
    title: 'Tentang Kreavify — Platform Freelancer Indonesia',
};

const features = [
    { Icon: FileText, title: 'Invoice Profesional', desc: 'Buat & kirim invoice berkualitas dengan logo kustom, warna aksen, multi-mata uang, dan PDF download.' },
    { Icon: ScrollText, title: 'Kontrak Digital AI', desc: 'Generate kontrak kerja profesional secara otomatis menggunakan AI berdasarkan data invoice kamu.' },
    { Icon: Bot, title: 'AI Pricing Assistant', desc: 'Analisis harga jasa yang wajar dan kompetitif berbasis data pasar nyata, segmen klien, dan kompleksitas proyek.' },
    { Icon: BarChart2, title: 'Laporan Pajak', desc: 'Ringkasan pendapatan tahunan lengkap dengan estimasi PPh sesuai regulasi UMKM Indonesia (PP 55/2022).' },
    { Icon: LayoutDashboard, title: 'Portfolio Publik', desc: 'Halaman profil publik dengan karya portfolio, jasa, dan kontak — share ke klien seperti kartu nama digital.' },
    { Icon: TrendingUp, title: 'Analitik Bisnis', desc: 'Pantau statistik kunjungan profil dan klik layanan untuk memahami tren dan pola dari calon klienmu.' },
];

export default function AboutPage() {
    return (
        <>
            <PublicNavbar />
            <div className={styles.pageWrapper}>
                {/* Hero */}
                <div className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.pill}>Tentang Kami</span>
                        <h1 className={styles.heroTitle}>Platform Manajemen Bisnis untuk Freelancer Kreatif</h1>
                        <p className={styles.heroSubtitle}>Kreavify lahir dari frustrasi nyata: kelola invoice masih pakai spreadsheet, kontrak ditulis manual, dan tidak tahu harga jasa yang adil. Kami hadir sebagai solusinya.</p>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Mission */}
                    <section>
                        <div className={styles.missionGrid}>
                            <div className={styles.missionCard} style={{ '--accent': '#4f46e5' }}>
                                <div className={styles.missionIcon}><Target size={22} /></div>
                                <h3>Misi Kami</h3>
                                <p>Memberdayakan jutaan kreator independen Indonesia dengan alat profesional — bukan hanya sebagai pelengkap, tapi sebagai fondasi bisnis yang menghasilkan kepercayaan klien.</p>
                            </div>
                            <div className={styles.missionCard} style={{ '--accent': '#7c3aed' }}>
                                <div className={styles.missionIcon}><Eye size={22} /></div>
                                <h3>Visi Kami</h3>
                                <p>Menjadi ekosistem freelance pertama di Asia Tenggara yang menggabungkan manajemen keuangan, AI pricing intelligence, dan kontrak digital dalam satu platform terintegrasi.</p>
                            </div>
                            <div className={styles.missionCard} style={{ '--accent': '#2563eb' }}>
                                <div className={styles.missionIcon}><Lightbulb size={22} /></div>
                                <h3>Nilai Kami</h3>
                                <p>Transparan, sederhana, dan bertenaga. Kami percaya alat terbaik adalah yang tidak membutuhkan manual — cukup buka, dan langsung bisa dipakai.</p>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className={styles.statsSection}>
                        <div className={styles.statsGrid}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>6+</span>
                                <span className={styles.statLabel}>Fitur Unggulan</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>AI</span>
                                <span className={styles.statLabel}>Powered Pricing</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Gratis untuk Mulai</span>
                            </div>
                            <div className={styles.stat}>
                                <MapPin size={28} className={styles.statIcon} />
                                <span className={styles.statLabel}>Made for Indonesia</span>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section>
                        <h2 className={styles.sectionTitle}>Apa yang Kreavify Tawarkan?</h2>
                        <div className={styles.featureGrid}>
                            {features.map((f, i) => (
                                <div key={i} className={styles.featureCard}>
                                    <div className={styles.featureIconWrap}>
                                        <f.Icon size={20} />
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CTA Footer */}
                <div className={styles.ctaSection}>
                    <h2>Siap memulai perjalanan freelance yang lebih terorganisir?</h2>
                    <p>Gratis selamanya. Tidak butuh kartu kredit.</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/register" className={styles.primaryCta}>Mulai Gratis Sekarang</Link>
                        <Link href="/help" className={styles.secondaryCta}>Pelajari Cara Penggunaan</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
