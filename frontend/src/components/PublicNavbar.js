'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './public-navbar.module.css';
import { useI18n } from '@/lib/i18n';

const NAV_HEIGHT = 64;

export default function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t } = useI18n();

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeMenu();
        };
        if (menuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <>
            <nav className={styles.navbar} aria-label="Navigasi utama">
                <div className={styles.container}>
                    <Link href="/" className={styles.logo} onClick={closeMenu}>
                        {t('common.brand')}
                    </Link>
                    <div className={styles.links}>
                        <Link href="/about" className={styles.link}>{t('common.nav.about')}</Link>
                        <Link href="/help" className={styles.link}>{t('common.nav.help')}</Link>
                        <Link href="/contact" className={styles.link}>{t('common.nav.contact')}</Link>
                    </div>
                    <div className={styles.cta}>
                        <Link href="/login" className={styles.loginBtn}>{t('common.nav.login')}</Link>
                        <Link href="/register" className={styles.registerBtn}>{t('common.nav.register')}</Link>
                    </div>
                    <button
                        type="button"
                        className={styles.hamburgerBtn}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            <div
                className={`${styles.drawerOverlay} ${menuOpen ? styles.drawerOverlayOpen : ''}`}
                onClick={closeMenu}
                role="presentation"
                aria-hidden={!menuOpen}
            />
            <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerContent}>
                    <Link href="/about" className={styles.drawerLink} onClick={closeMenu}>{t('common.nav.about')}</Link>
                    <Link href="/help" className={styles.drawerLink} onClick={closeMenu}>{t('common.nav.help')}</Link>
                    <Link href="/contact" className={styles.drawerLink} onClick={closeMenu}>{t('common.nav.contact')}</Link>
                    <div className={styles.drawerDivider} />
                    <Link href="/login" className={styles.drawerLink} onClick={closeMenu}>{t('common.nav.login')}</Link>
                    <Link href="/register" className={styles.drawerLinkCta} onClick={closeMenu}>{t('common.nav.register')}</Link>
                </div>
            </div>
        </>
    );
}

export { NAV_HEIGHT };
