'use client';
import { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './header.module.css';
import ConfirmDialog from './ConfirmDialog';

export default function Header() {
    const [profile, setProfile] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);
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
                {/* Upgrade CTA */}
                <Link href="/upgrade" className={styles.upgradeBtn}>
                    <Zap size={15} />
                    Upgrade Plan
                </Link>

                <div className={styles.profileWrapper} ref={dropdownRef}>
                    <button
                        className={styles.profileBtn}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {profile?.display_name?.charAt(0) || <User size={16} />}
                            </div>
                        )}
                        {profile && (
                            <span className={styles.profileName}>{profile.display_name}</span>
                        )}
                    </button>

                    {dropdownOpen && (
                        <div className={styles.profileDropdown}>
                            <div className={styles.dropdownHeader}>
                                <div className={styles.dropdownAvatar}>
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="" className={styles.dropdownAvatarImg} />
                                    ) : (
                                        <div className={styles.dropdownAvatarFallback}>
                                            {profile?.display_name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className={styles.dropdownName}>{profile?.display_name || 'User'}</p>
                                    <p className={styles.dropdownSub}>{profile?.profession?.replace('_', ' ') || 'Kreator'}</p>
                                </div>
                            </div>
                            <div className={styles.dropdownMenu}>
                                <Link href="/profile" className={styles.menuItem} onClick={() => setDropdownOpen(false)}>
                                    <User size={16} /> Edit Profil
                                </Link>
                                <Link href="/settings" className={styles.menuItem} onClick={() => setDropdownOpen(false)}>
                                    <Settings size={16} /> Pengaturan
                                </Link>
                                <div className={styles.divider}></div>
                                <button onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }} className={`${styles.menuItem} ${styles.logoutItem}`}>
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
