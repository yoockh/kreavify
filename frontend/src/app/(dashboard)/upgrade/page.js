'use client';
import { ArrowLeft, Check, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function UpgradePlanPage() {
    const router = useRouter();

    const plans = [
        {
            name: 'Hackathon Mode',
            price: 'Gratis',
            icon: <Zap size={24} color="#6366f1" />,
            badge: 'Aktif',
            description: 'Semua fitur Kreavify, termasuk AI Pricing Assistant, dapat digunakan tanpa batas selama sesi hackathon & demo.',
            features: [
                'Invoice & Kuitansi tanpa batas',
                'Manajemen Jasa & Klien',
                'Portofolio & Profil Publik',
                'AI Pricing Assistant tanpa batas',
                'Laporan Keuangan & Insight Dasar',
            ],
            buttonText: 'Paket Aktif',
            buttonStyle: 'primary',
            disabled: true,
        },
    ];

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} /> Kembali
            </button>

            <div className={styles.header}>
                <h1 className={styles.title}>Hackathon Mode Aktif</h1>
                <p className={styles.subtitle}>
                    Untuk keperluan demo & presentasi, semua fitur—including AI—telah dibuka penuh tanpa batasan paket.
                </p>
            </div>

            <div className={styles.pricingGrid}>
                {plans.map((plan, i) => (
                    <div key={i} className={`${styles.card} ${plan.badge ? styles.popularCard : ''}`}>
                        {plan.badge && <div className={styles.badge}>{plan.badge}</div>}

                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>{plan.icon}</div>
                            <h2 className={styles.planName}>{plan.name}</h2>
                            <div className={styles.planPrice}>{plan.price}</div>
                            <p className={styles.planDesc}>{plan.description}</p>
                        </div>

                        <div className={styles.featuresList}>
                            {plan.features.map((feature, j) => (
                                <div key={j} className={styles.featureItem}>
                                    <Check size={16} className={styles.checkIcon} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            className={`${styles.btn} ${styles[plan.buttonStyle]}`}
                            disabled={plan.disabled}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
