import styles from './serviceCard.module.css';

export default function ServiceCard({ service, onToggle, onEdit, onDelete }) {
    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={`${styles.card} ${!service.is_active ? styles.inactive : ''}`}>
            <div className={styles.header}>
                <span className={styles.category}>{service.category.replace('_', ' ')}</span>
                <div className={styles.toggleWrapper}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={service.is_active}
                            onChange={() => onToggle(service)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>

            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>

            <div className={styles.footer}>
                <div className={styles.price}>
                    <span className={styles.priceLabel}>Mulai dari</span>
                    <span className={styles.priceValue}>{formatRp(service.base_price)}</span>
                </div>

                <div className={styles.actions}>
                    <button onClick={() => onEdit(service)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => onDelete(service.id)} className={styles.deleteBtn}>Hapus</button>
                </div>
            </div>
        </div>
    );
}
