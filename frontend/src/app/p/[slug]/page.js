import { getPublicProfile } from '@/lib/api';
import { Mail, Instagram, Globe, CheckCircle, ExternalLink } from 'lucide-react';
import styles from './page.module.css';

export default async function PublicProfilePage({ params }) {
    const { slug } = params;

    let profile = null;
    try {
        const res = await getPublicProfile(slug);
        if (res.ok) {
            profile = await res.json();
        }
    } catch (e) {
        console.error(e);
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-500 mb-6">Kreator tidak ditemukan.</p>
                <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Ke Beranda Kreavify</a>
            </div>
        );
    }

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            {/* Cover / Header Layer */}
            <div className={styles.coverPhoto}></div>

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
        </div>
    );
}
