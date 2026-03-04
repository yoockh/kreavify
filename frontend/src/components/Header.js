'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './header.module.css';
import ConfirmDialog from './ConfirmDialog';

export default function Header() {
    const [profile, setProfile] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        import('@/lib/api').then(({ getProfile }) => {
            getProfile().then(res => res.json()).then(data => {
                setProfile(data);
            }).catch(err => console.error(err));
        });

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.spacer}></div>

            <div className={styles.actions}>
                <div className={styles.notifWrapper} ref={notifRef}>
                    <button
                        className={styles.iconBtn}
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setDropdownOpen(false);
                        }}
                    >
                        <Bell size={20} />
                        <span className={styles.badge}>2</span>
                    </button>

                    {notificationsOpen && (
                        <div className={styles.notifDropdown}>
                            <h3 className={styles.dropdownTitle}>Notifikasi</h3>
                            <div className={styles.notifList}>
                                <div className={styles.notifItem}>
                                    <div className={styles.notifDot}></div>
                                    <div className={styles.notifContent}>
                                        <p><strong>PT Karya Bangsa</strong> telah membayar invoice KK-2024-0001</p>
                                        <span>2 jam yang lalu</span>
                                    </div>
                                </div>
                                <div className={styles.notifItem}>
                                    <div className={styles.notifDot}></div>
                                    <div className={styles.notifContent}>
                                        <p>Kontrak desain logo telah disetujui</p>
                                        <span>1 hari yang lalu</span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/dashboard" className={styles.viewAllBtn}>Lihat Semua</Link>
                        </div>
                    )}
                </div>

                <div className={styles.profileWrapper} ref={dropdownRef}>
                    <button
                        className={styles.profileBtn}
                        onClick={() => {
                            setDropdownOpen(!dropdownOpen);
                            setNotificationsOpen(false);
                        }}
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {profile?.display_name?.charAt(0) || <User size={16} />}
                            </div>
                        )}
                    </button>

                    {dropdownOpen && (
                        <div className={styles.profileDropdown}>
                            <div className={styles.dropdownHeader}>
                                <p className={styles.dropdownName}>{profile?.display_name || 'User'}</p>
                                <p className={styles.dropdownEmail}>{profile?.email || 'user@email.com'}</p>
                            </div>
                            <div className={styles.dropdownMenu}>
                                <Link href="/profile" className={styles.menuItem} onClick={() => setDropdownOpen(false)}>
                                    <User size={16} /> Edit Profil
                                </Link>
                                <Link href="/settings" className={styles.menuItem} onClick={() => setDropdownOpen(false)}>
                                    <Settings size={16} /> Pengaturan
                                </Link>
                                <div className={styles.divider}></div>
                                <button onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }} className={`${styles.menuItem} ${styles.logoutBtn}`}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Apakah kamu yakin ingin keluar dari akun Kreavify?"
                variant="warning"
            />
        </header>
    );
}
