'use client';
import { ArrowLeft, Check, Diamond, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function UpgradePlanPage() {
    const router = useRouter();

    const plans = [
        {
            name: "Basic Free",
            price: "Gratis",
            icon: <Star size={24} color="#94a3b8" />,
            description: "Cocok untuk freelancer pemula yang baru memulai.",
            features: [
                "Invoice & Kuitansi (Unlimited)",
                "Manajemen Jasa Dasar",
                "Portofolio Standar (Maks 10)",
                "AI Pricing Assistant (3x/bulan)",
                "Laporan Keuangan Standar"
            ],
            buttonText: "Paket Saat Ini",
            buttonStyle: "secondary",
            disabled: true
        },
        {
            name: "Premium",
            price: "$5 / bulan",
            icon: <Zap size={24} color="#6366f1" />,
            badge: "Paling Populer",
            description: "Tingkatkan profesionalitas dengan fitur lanjutan.",
            features: [
                "Semua fitur Basic",
                "Custom Domain Profil (contoh.com)",
                "Branded Invoice (Logo & Warna)",
                "AI Pricing Assistant (20x/bulan)",
                "Kontrak Digital (Generate AI)",
                "Auto Reminder Tagihan via WA",
                "Laporan Pajak PPh UMKM"
            ],
            buttonText: "Pilih Premium",
            buttonStyle: "primary",
            disabled: false
        },
        {
            name: "Pro",
            price: "$10 / bulan",
            icon: <Diamond size={24} color="#f59e0b" />,
            description: "Untuk freelancer sibuk dengan banyak klien.",
            features: [
                "Semua fitur Premium",
                "AI Pricing Assistant (Unlimited)",
                "Analitik Profil Lanjutan",
                "Multi-Currency (USD, EUR, SGD)",
                "Prioritas Dukungan Pelanggan",
                "Tanpa Watermark Kreavify"
            ],
            buttonText: "Pilih Pro",
            buttonStyle: "outline",
            disabled: false
        }
    ];

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} /> Kembali
            </button>

            <div className={styles.header}>
                <h1 className={styles.title}>Tingkatkan Paket Anda</h1>
                <p className={styles.subtitle}>Pilih paket yang paling sesuai dengan kebutuhan freelance Anda</p>
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
