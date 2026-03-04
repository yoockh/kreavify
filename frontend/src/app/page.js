import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Brain } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navbar Minimalis */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Kreavify</div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.loginBtn}>Masuk</Link>
          <Link href="/register" className={styles.registerBtn}>Daftar Gratis</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>Dibuat untuk Kreator Indonesia 🇮🇩</div>
            <h1 className={styles.title}>
              Kirim Tagihan Lebih Cepat, <br />
              <span className={styles.gradientText}>Terima Bayaran Tanpa Ribet</span>
            </h1>
            <p className={styles.subtitle}>
              Platform invoice & pembayaran digital khusus untuk freelancer kreatif.
              Buat tagihan dalam 30 detik, bagikan link, dan biarkan klien bayar lewat metode pilihan mereka.
            </p>

            <div className={styles.ctaGroup}>
              <Link href="/register" className={styles.primaryCta}>
                Mulai Sekarang Gratis <ArrowRight size={20} />
              </Link>
              <Link href="#features" className={styles.secondaryCta}>
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <div className={styles.heroMockup}>
              {/* Fake dashboard mockup for visual appeal */}
              <div className={styles.mockupHeader}>
                <div className={styles.dots}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.fakeUrl}>app.kreavify.id/dashboard</div>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupSidebar}></div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupWidget}></div>
                  <div className={styles.mockupGrid}>
                    <div className={styles.mockupCard}></div>
                    <div className={styles.mockupCard}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decoration blur elements */}
            <div className={styles.blurBlue}></div>
            <div className={styles.blurPurple}></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <h2 className={styles.sectionTitle}>Semua yang Freelancer Butuhkan</h2>
          <p className={styles.sectionSubtitle}>Fokus berkarya, biarkan kami yang urus administrasinya.</p>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <Zap size={24} />
              </div>
              <h3>Invoice 30 Detik</h3>
              <p>Pilih jasa dari katalogmu, tentukan klien, dan invoice siap dikirim lengkap dengan link pembayaran.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <Shield size={24} />
              </div>
              <h3>Pembayaran Aman</h3>
              <p>Klien bisa bayar via QRIS, Virtual Account, atau e-Wallet favorit mereka (ditenagai oleh Midtrans).</p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrapper} ${styles.purple}`}>
                <Brain size={24} />
              </div>
              <h3>AI Pricing Suggestion</h3>
              <p>Ragu nentuin harga? Fitur AI kami akan memberikan rekomendasi harga pasar yang wajar agar kamu tidak underprice.</p>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className={styles.valueProps}>
          <div className={styles.vpContainer}>
            <div className={styles.vpText}>
              <h2>Lebih Profesional di Mata Klien</h2>
              <ul className={styles.checkList}>
                <li><CheckCircle size={20} className={styles.checkIcon} /> Punya halaman profil portofolio sendiri</li>
                <li><CheckCircle size={20} className={styles.checkIcon} /> Invoice PDF rapi dan standar industri</li>
                <li><CheckCircle size={20} className={styles.checkIcon} /> Notifikasi otomatis saat invoice dibayar</li>
              </ul>
            </div>
            <div className={styles.vpImage}>
              <div className={styles.profileMockup}>
                <div className={styles.avatar}></div>
                <div className={styles.nameLine}></div>
                <div className={styles.descLine}></div>
                <div className={styles.gridMini}>
                  <div></div><div></div><div></div><div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>Kreavify</div>
          <p className={styles.footerDesc}>
            Mendukung UMKM & Kreator Indonesia dalam Digitalisasi Ekonomi Kreatif.
            <br />Hackathon BI 2026.
          </p>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Kreavify. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
