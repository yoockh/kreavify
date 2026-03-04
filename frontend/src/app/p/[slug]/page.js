import { Mail, CheckCircle } from 'lucide-react';
import styles from './page.module.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';

// Use internal backend URL for SSR (server-to-server), fallback to localhost
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000/api';

export default async function PublicProfilePage({ params }) {
    const { slug } = await params;

    let profile = null;
    try {
        const res = await fetch(`${BACKEND_URL}/p/${slug}/`, { cache: 'no-store' });
        if (res.ok) {
            profile = await res.json();
        }
    } catch (e) {
        console.error('Exception fetching public profile:', e);
    }

    if (!profile) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>404</h1>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Kreator tidak ditemukan.</p>
                <a href="/" style={{ padding: '0.625rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>Ke Beranda Kreavify</a>
            </div>
        );
    }

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            {/* Cover / Header Layer */}
            <div
                className={styles.coverPhoto}
                style={profile.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : {}}
            ></div>

            <main className={styles.mainContent}>
                {/* Profile Card Overlay */}
                <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.display_name} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {profile.display_name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={styles.verifiedBadge} title="Verified Creator">
                            <CheckCircle size={20} fill="#10B981" color="white" />
                        </div>
                    </div>

                    <h1 className={styles.name}>{profile.display_name}</h1>
                    <p className={styles.profession}>{profile.profession.replace('_', ' ').toUpperCase()}</p>

                    <p className={styles.bio}>{profile.bio || "Halo! Saya adalah kreator yang siap membantu project kamu."}</p>

                    <div className={styles.socialLinks}>
                        <a href={`mailto:${profile.email}`} className={styles.socialBtn}>
                            <Mail size={18} /> Email Saya
                        </a>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className={styles.contentSections}>

                    {/* Portfolio Section */}
                    {profile.portfolio?.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Portfolio Karya</h2>
                            <div className={styles.portfolioGrid}>
                                {profile.portfolio.map(item => (
                                    <div key={item.id} className={styles.portfolioCard}>
                                        <div className={styles.imageContainer}>
                                            <img src={item.image_url} alt={item.title} className={styles.portImage} />
                                        </div>
                                        <div className={styles.portInfo}>
                                            <span className={styles.portCat}>{item.category.replace('_', ' ')}</span>
                                            <h3 className={styles.portTitle}>{item.title}</h3>
                                            {item.description && <p className={styles.portDesc}>{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Services Section */}
                    {profile.services?.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Jasa yang Ditawarkan</h2>
                            <div className={styles.servicesGrid}>
                                {profile.services.map(service => (
                                    <div key={service.id} className={styles.serviceCard}>
                                        {service.image_url ? (
                                            <div className={styles.serviceImageContainer}>
                                                <img src={service.image_url} alt={service.title} className={styles.serviceImage} />
                                            </div>
                                        ) : (
                                            <div className={styles.serviceImagePlaceholder}>
                                                <span className={styles.servicePlaceholderText}>K</span>
                                            </div>
                                        )}
                                        <div className={styles.serviceHeader}>
                                            <span className={styles.serviceCat}>{service.category.replace('_', ' ')}</span>
                                            <div className={styles.priceRow}>
                                                <span className={styles.priceStart}>Mulai dari</span>
                                                <span className={styles.priceValue}>{formatRp(service.base_price)}</span>
                                            </div>
                                        </div>
                                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                                        <p className={styles.serviceDesc}>{service.description}</p>
                                        <a href={`mailto:${profile.email}?subject=Tanya Jasa: ${service.title}`} className={styles.contactBtn}>
                                            Tanya Jasa Ini
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </main>

            {/* Powered by Footer */}
            <footer className={styles.footer}>
                <a href="/" className={styles.poweredBy}>
                    <span>Ditenagai oleh</span>
                    <strong>Kreavify</strong>
                </a>
            </footer>

            {/* Analytics Tracking */}
            <AnalyticsTracker slug={slug} />
        </div>
    );
}
