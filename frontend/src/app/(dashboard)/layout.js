import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <Header />
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
