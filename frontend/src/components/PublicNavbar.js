import Link from 'next/link';
import styles from './public-navbar.module.css';

export default function PublicNavbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Kreavify
                </Link>
                <div className={styles.links}>
                    <Link href="/about" className={styles.link}>Tentang</Link>
                    <Link href="/help" className={styles.link}>Bantuan</Link>
                    <Link href="/contact" className={styles.link}>Hubungi Kami</Link>
                </div>
                <div className={styles.cta}>
                    <Link href="/login" className={styles.loginBtn}>Masuk</Link>
                    <Link href="/register" className={styles.registerBtn}>Daftar Gratis</Link>
                </div>
            </div>
        </nav>
    );
}
