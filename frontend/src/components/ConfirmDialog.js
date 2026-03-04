'use client';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import styles from './confirmDialog.module.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, variant = 'danger' }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.dialog} onClick={e => e.stopPropagation()}>
                <div className={`${styles.iconWrapper} ${styles[variant]}`}>
                    {variant === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelBtn}>Batal</button>
                    <button onClick={onConfirm} className={`${styles.confirmBtn} ${styles[`confirmBtn_${variant}`]}`}>
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
}
