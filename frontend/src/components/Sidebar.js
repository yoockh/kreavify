'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, Image as ImageIcon, ExternalLink, PanelLeftClose, PanelLeftOpen, Sun, Moon, ScrollText, Calculator, Settings, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/lib/sidebar-context';
import styles from './sidebar.module.css';
import { useI18n } from '@/lib/i18n';

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profile, setProfile] = useState(null);
    const { mobileOpen, setMobileOpen } = useSidebar();
    const { t } = useI18n();

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
            main.style.marginLeft = collapsed ? '72px' : '260px';
        }
    }, [collapsed]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    };

    const menuItems = [
        { label: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { label: t('sidebar.invoices'), href: '/invoices', icon: FileText },
        { label: t('sidebar.services'), href: '/services', icon: Briefcase },
        { label: t('sidebar.aiInsights'), href: '/ai-insights', icon: Brain },
        { label: t('sidebar.portfolio'), href: '/portfolio', icon: ImageIcon },
        { label: t('sidebar.contracts'), href: '/contracts', icon: ScrollText },
        { label: t('sidebar.taxReport'), href: '/tax-report', icon: Calculator },
        { label: t('sidebar.settings'), href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Backdrop — mobile only */}
            {mobileOpen && (
                <div className={styles.mobileBackdrop} onClick={() => setMobileOpen(false)} />
            )}

            <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
                <div className={styles.logoRow}>
                    {(!collapsed || mobileOpen) && <span className={styles.logoText}>{t('common.brand')}</span>}
                    {/* Collapse button — desktop only, hidden on mobile */}
                    <button className={`${styles.collapseBtn} ${styles.collapseBtnDesktop}`} onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
                        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        const showLabel = !collapsed || mobileOpen;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                title={!showLabel ? item.label : ''}
                            >
                                <Icon size={20} className={styles.icon} />
                                {showLabel && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.footerDivider} />
                    <button className={styles.themeToggle} onClick={toggleDarkMode} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {(!collapsed || mobileOpen) && <span>{darkMode ? t('sidebar.lightMode') : t('sidebar.darkMode')}</span>}
                    </button>
                    {profile?.slug && (
                        <a
                            href={`/p/${profile.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.footerLink}
                            title={collapsed && !mobileOpen ? t('sidebar.publicProfile') : ''}
                        >
                            <ExternalLink size={18} className={styles.icon} />
                            {(!collapsed || mobileOpen) && <span>{t('sidebar.publicProfile')}</span>}
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

