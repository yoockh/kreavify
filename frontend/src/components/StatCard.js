import styles from './statCard.module.css';

export default function StatCard({ title, value, icon: Icon, color = 'var(--primary)' }) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15`, color }}>
                {Icon && <Icon size={24} />}
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <h3 className={styles.value}>{value}</h3>
            </div>
        </div>
    );
}
