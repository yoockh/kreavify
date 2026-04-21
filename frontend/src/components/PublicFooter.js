import Link from 'next/link';
import styles from './public-footer.module.css';
import { useI18n } from '@/lib/i18n';

export default function PublicFooter() {
    const { t } = useI18n();
    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.footerBrand}>
                    <div className={styles.footerLogo}>{t('common.brand')}</div>
                    <p className={styles.footerDesc}>
                        {t('common.footer.brandDescLine1')}<br />
                        {t('common.footer.brandDescLine2')}
                    </p>
                </div>
                <div className={styles.footerLinks}>
                    <div className={styles.footerCol}>
                        <h4>{t('common.footer.columns.product')}</h4>
                        <Link href="/register">{t('common.footer.links.register')}</Link>
                        <Link href="/login">{t('common.footer.links.login')}</Link>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>{t('common.footer.columns.info')}</h4>
                        <Link href="/about">{t('common.footer.links.about')}</Link>
                        <Link href="/help">{t('common.footer.links.help')}</Link>
                        <Link href="/contact">{t('common.footer.links.contact')}</Link>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>{t('common.footer.columns.legal')}</h4>
                        <Link href="/privacy">{t('common.footer.links.privacy')}</Link>
                        <Link href="/terms">{t('common.footer.links.terms')}</Link>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                © {new Date().getFullYear()} {t('common.brand')}. {t('common.footer.copyright')}
            </div>
        </footer>
    );
}
