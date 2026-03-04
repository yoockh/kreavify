'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, Image as ImageIcon, User, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        // Get slug info for public profile link
        import('@/lib/api').then(({ getProfile }) => {
            getProfile().then(res => res.json()).then(data => {
                if (data.slug) setSlug(data.slug);
            }).catch(err => console.error(err));
        });
    }, []);

    const handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        router.push('/login');
    };

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Invoice', href: '/invoices', icon: FileText },
        { label: 'Jasa Saya', href: '/services', icon: Briefcase },
        { label: 'Portfolio', href: '/portfolio', icon: ImageIcon },
        { label: 'Profil', href: '/profile', icon: User },
    ];

    return (
        <>
            <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    KaryaKita
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} className={styles.icon} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    {slug && (
                        <a
                            href={`/p/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            <ExternalLink size={20} className={styles.icon} />
                            Lihat Profil Publik
                        </a>
                    )}

                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} className={styles.icon} />
                        Logout
                    </button>
                </div>
            </div>

            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
        </>
    );
}
