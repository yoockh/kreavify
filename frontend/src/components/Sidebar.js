'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, Image as ImageIcon, ExternalLink, PanelLeftClose, PanelLeftOpen, Sun, Moon, ScrollText, Calculator, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('sidebar_collapsed');
        if (saved === 'true') setCollapsed(true);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    useEffect(() => {
        import('@/lib/api').then(({ getProfile }) => {
            getProfile().then(res => res.json()).then(data => {
                setProfile(data);
            }).catch(err => console.error(err));
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', collapsed);
        const main = document.querySelector('main');
        if (main && window.innerWidth > 768) {
            main.style.marginLeft = collapsed ? '72px' : '250px';
        }
    }, [collapsed]);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    };


    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Invoice', href: '/invoices', icon: FileText },
        { label: 'Jasa Saya', href: '/services', icon: Briefcase },
        { label: 'Portfolio', href: '/portfolio', icon: ImageIcon },
        { label: 'Kontrak', href: '/contracts', icon: ScrollText },
        { label: 'Laporan Pajak', href: '/tax-report', icon: Calculator },
        { label: 'Pengaturan', href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleOpen : ''}`}
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                <div className={styles.hamburger}>
                    <span></span><span></span><span></span>
                </div>
            </button>

            {/* Backdrop for mobile */}
            {mobileOpen && (
                <div className={styles.mobileBackdrop} onClick={() => setMobileOpen(false)} />
            )}

            <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
                <div className={styles.logoRow}>
                    {!collapsed && <span className={styles.logoText}>Kreavify</span>}
                    <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
                        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
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
                                title={collapsed ? item.label : ''}
                            >
                                <Icon size={20} className={styles.icon} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.footerDivider} />

                    <button className={styles.themeToggle} onClick={toggleDarkMode} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    {profile?.slug && (
                        <a
                            href={`/p/${profile.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.footerLink}
                            title={collapsed ? 'Profil Publik' : ''}
                        >
                            <ExternalLink size={18} className={styles.icon} />
                            {!collapsed && <span>Profil Publik</span>}
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}
