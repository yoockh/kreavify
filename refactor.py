import os

def replace_in_file(filepath, replacements, add_i18n=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    if add_i18n and "useI18n" not in content:
        import_idx = content.find("import ")
        if import_idx != -1:
            content = content[:import_idx] + "import { useI18n } from '@/lib/i18n';\n" + content[import_idx:]

        fn_idx = content.find("export default function")
        if fn_idx != -1:
            body_idx = content.find("{", fn_idx)
            if body_idx != -1:
                content = content[:body_idx+1] + "\n    const { t } = useI18n();" + content[body_idx+1:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = '/home/yoockh/Documents/hackathon/frontend/src/app/(dashboard)'

# dashboard/page.js
dashboard_replacements = [
    (">Overview<", ">{t('dashboard.title')}<"),
    (">Ringkasan aktivitas dan pendapatan kamu<", ">{t('dashboard.subtitle')}<"),
    (">AI Financial Intelligence<", ">{t('dashboard.aiTitle')}<"),
    (">Prediksi berbasis analisis pola historis. Confidence score menunjukkan tingkat akurasi.<", ">{t('dashboard.aiSubtitle')}<"),
    ("Lihat Semua", "{t('dashboard.seeAll')}"),
    (">Prediksi Pendapatan Bulan Depan<", ">{t('dashboard.nextMonthForecast')}<"),
    ("? 'Naik' : forecast.insights?.trend === 'turun' ? 'Turun' : 'Stabil'", "? t('dashboard.trendUp') : forecast.insights?.trend === 'turun' ? t('dashboard.trendDown') : t('dashboard.trendStable')"),
    (">Confidence<", ">{t('dashboard.confidence')}<"),
    (">Analisis Harga Jasa<", ">{t('dashboard.pricingAnalysis')}<"),
    ("Tambahkan jasa untuk mendapatkan analisis harga.", "{t('dashboard.addServiceToAnalyze')}"),
    (" jasa", " {t('dashboard.servicesCount')}"),
    ("terlalu murah dari harga pasar", "{t('dashboard.underpriced')}"),
    ("sudah sesuai harga pasar", "{t('dashboard.fairPriced')}"),
    ("Potensi kenaikan:", "{t('dashboard.potentialIncrease')}:"),
    ("Lihat Detail", "{t('dashboard.seeDetail')}"),
    (">Profil Freelancer<", ">{t('dashboard.freelancerProfile')}<"),
    (">Level Pengalaman<", ">{t('dashboard.experienceLevel')}<"),
    (">Total Invoice Dibayar<", ">{t('dashboard.totalPaidInvoices')}<"),
    (">Total Pendapatan<", ">{t('dashboard.totalRevenue')}<"),
    (">Rata-rata Proyek/Bulan<", ">{t('dashboard.avgProjectsPerMonth')}<"),
    ("title=\"Total Pendapatan\"", "title={t('dashboard.totalRevenue')}"),
    ("title=\"Menunggu Pembayaran\"", "title={t('dashboard.pendingPayment')}"),
    ("title=\"Total Invoice\"", "title={t('dashboard.totalInvoice')}"),
    ("title=\"Invoice Dibayar\"", "title={t('dashboard.paidInvoice')}"),
    ("title=\"Profile Views\"", "title={t('dashboard.profileViews')}"),
    ("title=\"Service Clicks\"", "title={t('dashboard.serviceClicks')}"),
    ("Tren Pendapatan {forecast ? '& Prediksi' : '6 Bulan Terakhir'}", "{t('dashboard.revenueTrend')} {forecast ? t('dashboard.andForecast') : t('dashboard.last6Months')}"),
    ("name === 'actual' ? 'Aktual' : name === 'forecast' ? 'Prediksi' : name", "name === 'actual' ? t('dashboard.actual') : name === 'forecast' ? t('dashboard.forecastAI') : name"),
    ("> Aktual", "> {t('dashboard.actual')}"),
    ("> Prediksi (AI)", "> {t('dashboard.forecastAI')}"),
    ("Range:", "{t('dashboard.range')}:"),
    ("Profile Views — 7 Hari Terakhir", "{t('dashboard.profileViews7Days')}"),
    (">Invoice Terbaru<", ">{t('dashboard.recentInvoices')}<"),
    (">No<", ">{t('dashboard.no')}<"),
    (">Klien<", ">{t('dashboard.client')}<"),
    (">Total<", ">{t('dashboard.total')}<"),
    (">Status<", ">{t('dashboard.status')}<"),
    ("inv.status === 'draft' ? 'Draft'", "inv.status === 'draft' ? t('dashboard.draft')"),
    ("inv.status === 'sent' ? 'Menunggu'", "inv.status === 'sent' ? t('dashboard.waiting')"),
    ("inv.status === 'paid' ? 'Dibayar' : 'Dibatalkan'", "inv.status === 'paid' ? t('dashboard.paid') : t('dashboard.cancelled')"),
    (">Belum ada invoice<", ">{t('dashboard.noInvoicesYet')}<"),
    ("Loading dashboard...", "{t('dashboard.loading')}"),
    ("Gagal memuat data", "{t('dashboard.errorLoading')}"),
    ("Belum cukup data. Minimal 2 bulan invoice terbayar.", "{t('dashboard.notEnoughData')}")
]
replace_in_file(os.path.join(base, 'dashboard/page.js'), dashboard_replacements)

# ai-insights/page.js
ai_replacements = [
    (">AI Financial Intelligence<", ">{t('aiInsightsPage.title')}<"),
    (">Analisis cerdas pendapatan dan penetapan harga jasa kamu<", ">{t('aiInsightsPage.subtitle')}<"),
    ("Prediksi berbasis pola historis transaksi. Gunakan sebagai panduan keputusan.", "{t('aiInsightsPage.disclaimer')}"),
    ("Memuat...", "{t('aiInsightsPage.loadingBtn')}"),
    ("Perbarui", "{t('aiInsightsPage.loadBtn')}"),
    (">Prediksi Pendapatan<", ">{t('aiInsightsPage.forecastSectionTitle')}<"),
    ("Prediksi {formatMonthLabel", "{t('aiInsightsPage.forecastPreLabel')} {formatMonthLabel"),
    ("? 'Naik' :", "? t('aiInsightsPage.trendUpDesc') :"),
    ("? 'Turun' : 'Stabil'", "? t('aiInsightsPage.trendDownDesc') : t('aiInsightsPage.trendStableDesc')"),
    ("dari bulan lalu", "{t('aiInsightsPage.fromLastMonth')}"),
    (">Tingkat Keyakinan<", ">{t('aiInsightsPage.confidenceLevel')}<"),
    (">Batas Bawah<", ">{t('aiInsightsPage.lowerBound')}<"),
    (">Batas Atas<", ">{t('aiInsightsPage.upperBound')}<"),
    (">Rata-rata Proyek<", ">{t('aiInsightsPage.avgProjects')}<"),
    (">/bln<", ">{t('aiInsightsPage.perMonth')}<"),
    ("Prediksi menggunakan time-series analysis dari data invoice terbayar Anda.", "{t('aiInsightsPage.forecastDisclaimer')}"),
    (">Level Pengalaman<", ">{t('aiInsightsPage.expLevel')}<"),
    ("Ditentukan berdasarkan jumlah invoice terbayar dan total pendapatan historis Anda.", "{t('aiInsightsPage.expNote')}"),
    ("Belum cukup data untuk prediksi pendapatan.", "{t('aiInsightsPage.notEnoughDataTitle')}"),
    ("Minimal 2 bulan dengan invoice terbayar diperlukan untuk mengaktifkan fitur ini.", "{t('aiInsightsPage.notEnoughDataDesc')}"),
    (">Analisis Harga Jasa<", ">{t('aiInsightsPage.pricingSectionTitle')}<"),
    ("Potensi kenaikan:", "{t('aiInsightsPage.potentialIncreaseBadge')}:"),
    ("Belum ada jasa untuk dianalisis.", "{t('aiInsightsPage.noServiceTitle')}"),
    ("Tambahkan jasa di halaman Jasa Saya untuk mendapatkan analisis harga pasar.", "{t('aiInsightsPage.noServiceDesc')}"),
    (" Terlalu Murah", " {t('aiInsightsPage.pillUnder')}"),
    (" Harga Sesuai", " {t('aiInsightsPage.pillFair')}"),
    (" Terlalu Mahal", " {t('aiInsightsPage.pillOver')}"),
    (">Harga Kamu<", ">{t('aiInsightsPage.yourPrice')}<"),
    (">vs<", ">{t('aiInsightsPage.vs')}<"),
    (">Optimal Pasar<", ">{t('aiInsightsPage.marketOptimal')}<"),
    ("Range pasar:", "{t('aiInsightsPage.marketRange')}:"),
    ("Berdasarkan data platform dan riset industri kreatif Indonesia.", "{t('aiInsightsPage.pricingDisclaimer')}"),
    (">Rekomendasi Tindakan<", ">{t('aiInsightsPage.actionTitle')}<"),
    (">Naikkan Harga Jasa<", ">{t('aiInsightsPage.actionUpPrice')}<"),
    ("jasa kamu berada di bawah harga pasar. Pertimbangkan untuk menaikkan harga agar lebih kompetitif dan menguntungkan.", "{t('aiInsightsPage.actionUpPriceDesc')}"),
    (">Cari Klien Baru<", ">{t('aiInsightsPage.actionFindClients')}<"),
    ("Tren pendapatan menunjukkan penurunan. Pertimbangkan untuk memperluas jaringan, mengaktifkan profil publik, atau menawarkan promo terbatas.", "{t('aiInsightsPage.actionFindClientsDesc')}"),
    ("Gagal Memuat Data AI", "{t('aiInsightsPage.failLoad')}"),
    ("Coba Lagi", "{t('aiInsightsPage.retry')}")
]
replace_in_file(os.path.join(base, 'ai-insights/page.js'), ai_replacements)

# contracts/page.js
contracts_replacements = [
    (">Kontrak Digital<", ">{t('contractsPage.title')}<"),
    (">Generate kontrak kerja freelance otomatis dari invoice dengan AI<", ">{t('contractsPage.subtitle')}<"),
    (" Generate Kontrak Baru", " {t('contractsPage.generateNew')}"),
    (">Generate Kontrak dari Invoice<", ">{t('contractsPage.modalTitle')}<"),
    (">Pilih invoice untuk dijadikan basis kontrak. AI akan generate kontrak lengkap secara otomatis.<", ">{t('contractsPage.modalDesc')}<"),
    (">Pilih Invoice...<", ">{t('contractsPage.selectInvoice')}<"),
    (">Batal<", ">{t('contractsPage.cancel')}<"),
    ("> Generating...<", "> {t('contractsPage.generating')}<"),
    ("> Generate dengan AI<", "> {t('contractsPage.generateWithAI')}<"),
    (">Belum ada kontrak<", ">{t('contractsPage.noContracts')}<"),
    ("Klik \"Generate Kontrak Baru\" untuk mulai.", "{t('contractsPage.noContractsDesc')}"),
    (">Cetak / PDF<", ">{t('contractsPage.printPDF')}<"),
    (">Pilih kontrak untuk melihat preview<", ">{t('contractsPage.previewPlaceholder')}<"),
    ("'Hapus Kontrak'", "t('contractsPage.deleteTitle')"),
    ("'Kontrak yang dihapus tidak bisa dikembalikan. Lanjutkan?'", "t('contractsPage.deleteConfirm')"),
    ("Memuat kontrak...", "{t('contractsPage.loading')}")
]
replace_in_file(os.path.join(base, 'contracts/page.js'), contracts_replacements)

# services/page.js
services_replacements = [
    (">Jasa Saya<", ">{t('servicesPage.title')}<"),
    (">Kelola jasa yang kamu tawarkan ke klien<", ">{t('servicesPage.subtitle')}<"),
    (" Tambah Jasa<", " {t('servicesPage.addService')}<"),
    (">Belum ada jasa<", ">{t('servicesPage.noServices')}<"),
    (">Mulai tambahkan jasa pertamamu agar klien bisa melihat penawaranmu.<", ">{t('servicesPage.noServicesDesc')}<"),
    ("? 'Edit Jasa' : 'Tambah Jasa Baru'", "? t('servicesPage.editService') : t('servicesPage.newService')"),
    (">Judul Jasa<", ">{t('servicesPage.serviceTitle')}<"),
    ("Misal: Desain Logo Premium", "{t('servicesPage.serviceTitlePh')}"),
    (">Kategori<", ">{t('servicesPage.category')}<"),
    (">Desain Logo<", ">{t('servicesPage.cat_logo')}<"),
    (">Branding & Identity<", ">{t('servicesPage.cat_branding')}<"),
    (">Desain Social Media<", ">{t('servicesPage.cat_social_media')}<"),
    (">Ilustrasi<", ">{t('servicesPage.cat_illustration')}<"),
    (">Foto Produk<", ">{t('servicesPage.cat_photo_product')}<"),
    (">Foto Event<", ">{t('servicesPage.cat_photo_event')}<"),
    (">Video Promosi<", ">{t('servicesPage.cat_video_promo')}<"),
    (">Video Event<", ">{t('servicesPage.cat_video_event')}<"),
    (">Copywriting<", ">{t('servicesPage.cat_copywriting')}<"),
    (">Penerjemahan<", ">{t('servicesPage.cat_translation')}<"),
    (">Produksi Musik<", ">{t('servicesPage.cat_music')}<"),
    (">Web Development<", ">{t('servicesPage.cat_web_dev')}<"),
    (">Lainnya<", ">{t('servicesPage.cat_other')}<"),
    (">Deskripsi Detail<", ">{t('servicesPage.detailDesc')}<"),
    ("Jelaskan apa saja yang didapat klien...", "{t('servicesPage.detailDescPh')}"),
    (">Harga Dasar (Rp)<", ">{t('servicesPage.basePrice')}<"),
    (" Cek Harga AI", " {t('servicesPage.checkAIPrice')}"),
    (">Kompleksitas<", ">{t('servicesPage.complexity')}<"),
    (">Sederhana<", ">{t('servicesPage.comp_simple')}<"),
    (">Menengah<", ">{t('servicesPage.comp_medium')}<"),
    (">Kompleks<", ">{t('servicesPage.comp_complex')}<"),
    (" Saran Harga Pasar", " {t('servicesPage.marketPriceSuggestion')}"),
    (" Memuat...<", " {t('servicesPage.loading')}<"),
    (">Minimum<", ">{t('servicesPage.min')}<"),
    (">Optimal<", ">{t('servicesPage.optimal')}<"),
    (">Maksimum<", ">{t('servicesPage.max')}<"),
    ("Berdasarkan ", "{t('servicesPage.basedOn')} "),
    (" data pasar", " {t('servicesPage.marketData')}"),
    (" Level ", " {t('servicesPage.level')} "),
    (">Gunakan Harga Optimal<", ">{t('servicesPage.useOptimalPrice')}<"),
    (">Batal<", ">{t('servicesPage.cancel')}<"),
    (">Simpan Jasa<", ">{t('servicesPage.saveService')}<"),
    ("'Hapus Jasa'", "t('servicesPage.deleteTitle')"),
    ("'Apakah kamu yakin ingin menghapus jasa ini? Aksi ini tidak dapat dibatalkan.'", "t('servicesPage.deleteConfirm')")
]
replace_in_file(os.path.join(base, 'services/page.js'), services_replacements)

# portfolio/page.js
portfolio_replacements = [
    (">Portfolio Karya<", ">{t('portfolioPage.title')}<"),
    (">Tampilkan hasil karya terbaikmu ke publik<", ">{t('portfolioPage.subtitle')}<"),
    (" Tambah Karya<", " {t('portfolioPage.addWork')}<"),
    (">Belum ada karya<", ">{t('portfolioPage.noWork')}<"),
    (">Tunjukkan hasil kerjamu agar klien semakin yakin memakai jasamu.<", ">{t('portfolioPage.noWorkDesc')}<"),
    (">Tambah Portfolio<", ">{t('portfolioPage.addPortfolio')}<"),
    (">Judul Karya<", ">{t('portfolioPage.workTitle')}<"),
    (">Pilih Kategori<", ">{t('portfolioPage.selectCategory')}<"),
    (">Gambar Portfolio<", ">{t('portfolioPage.portfolioImage')}<"),
    ("? 'Mengupload...' : 'Pilih Gambar dari Perangkat'", "? t('portfolioPage.uploadingPills') : t('portfolioPage.uploadPills')"),
    (">atau<", ">{t('portfolioPage.or')}<"),
    (">Cerita Singkat / Deskripsi (Opsional)<", ">{t('portfolioPage.shortStory')}<"),
    (">Batal<", ">{t('portfolioPage.cancel')}<"),
    (">Simpan<", ">{t('portfolioPage.save')}<"),
    ("'Yakin ingin menghapus item ini?'", "t('portfolioPage.deleteConfirm')")
]
replace_in_file(os.path.join(base, 'portfolio/page.js'), portfolio_replacements)

# invoices/page.js
invoices_replacements = [
    (">Invoice Saya<", ">{t('invoicesPage.title')}<"),
    (">Kelola semua tagihan ke klien<", ">{t('invoicesPage.subtitle')}<"),
    (" Buat Invoice Baru<", " {t('invoicesPage.newInvoice')}<"),
    (">Semua<", ">{t('invoicesPage.filterAll')}<"),
    (">Draft<", ">{t('invoicesPage.filterDraft')}<"),
    (">Terkirim<", ">{t('invoicesPage.filterSent')}<"),
    (">Dibayar<", ">{t('invoicesPage.filterPaid')}<"),
    (">Dibatalkan<", ">{t('invoicesPage.filterCancelled')}<"),
    ("Cari nama klien...", "{t('invoicesPage.searchPh')}"),
    (">No. Invoice<", ">{t('invoicesPage.invoiceNo')}<"),
    (">Klien<", ">{t('invoicesPage.client')}<"),
    (">Total Tagihan<", ">{t('invoicesPage.totalAmount')}<"),
    (">Status<", ">{t('invoicesPage.status')}<"),
    (">Tanggal<", ">{t('invoicesPage.date')}<"),
    (">Tidak ada invoice ditemukan.<", ">{t('invoicesPage.noInvoiceFound')}<"),
    ("inv.status === 'draft' ? 'Draft'", "inv.status === 'draft' ? t('dashboard.draft')"),
    ("inv.status === 'sent' ? 'Menunggu'", "inv.status === 'sent' ? t('dashboard.waiting')"),
    ("inv.status === 'paid' ? 'Dibayar' : 'Dibatalkan'", "inv.status === 'paid' ? t('dashboard.paid') : t('dashboard.cancelled')"),
    ("Lihat Detail", "{t('invoicesPage.seeDetail')}"),
    (" Kirim ke Klien", " {t('invoicesPage.sendToClient')}"),
    (" Hapus", " {t('invoicesPage.delete')}"),
    (" Salin Link Bayar", " {t('invoicesPage.copyPayLink')}"),
    (" Batalkan", " {t('invoicesPage.cancelInvoiceBtn')}"),
    ("'Hapus Draft Invoice'", "t('invoicesPage.deleteDraftTitle')"),
    ("'Apakah kamu yakin ingin menghapus draft invoice ini? Aksi ini tidak dapat dibatalkan.'", "t('invoicesPage.deleteDraftConfirm')"),
    ("'Kirim Invoice'", "t('invoicesPage.sendTitle')"),
    ("'Invoice akan dikirim ke klien dan link pembayaran akan dibuat. Lanjutkan?'", "t('invoicesPage.sendConfirm')"),
    ("'Batalkan Invoice'", "t('invoicesPage.cancelTitle')"),
    ("'Apakah kamu yakin ingin membatalkan invoice ini? Klien tidak akan bisa membayar lagi.'", "t('invoicesPage.cancelConfirm')")
]
replace_in_file(os.path.join(base, 'invoices/page.js'), invoices_replacements)

# tax-report/page.js
tax_replacements = [
    (">Laporan Pajak<", ">{t('taxReportPage.title')}<"),
    (">Rekap penghasilan tahunan untuk pelaporan SPT<", ">{t('taxReportPage.subtitle')}<"),
    (" Cetak / PDF<", " {t('taxReportPage.printPDF')}<"),
    (">Total Pendapatan ", ">{t('taxReportPage.totalRevenue')} "),
    (">Estimasi PPh Final ", ">{t('taxReportPage.estFinalTax')} "),
    (">Total Invoice Dibayar<", ">{t('taxReportPage.totalPaidInvoices')}<"),
    (">Rincian Pendapatan Bulanan — ", ">{t('taxReportPage.monthlyBreakdown')} "),
    (">Bulan<", ">{t('taxReportPage.month')}<"),
    (">Jumlah Invoice<", ">{t('taxReportPage.invoiceCount')}<"),
    (">Pendapatan<", ">{t('taxReportPage.revenue')}<"),
    (">PPh 0.5%<", ">{t('taxReportPage.tax05')}<"),
    (">TOTAL<", ">{t('taxReportPage.total')}<"),
    ("Memuat laporan pajak...", "{t('taxReportPage.loading')}"),
    ("Gagal memuat data", "{t('taxReportPage.failLoad')}")
]
replace_in_file(os.path.join(base, 'tax-report/page.js'), tax_replacements)

# profile/page.js
profile_replacements = [
    (">Pengaturan Profil<", ">{t('profilePage.title')}<"),
    (">Atur informasi publik dan metode pencairan dana<", ">{t('profilePage.subtitle')}<"),
    ("? 'Mengupload...' : 'Ganti Banner'", "? t('profilePage.uploading') : t('profilePage.changeBanner')"),
    (">Info Dasar<", ">{t('profilePage.basicInfo')}<"),
    (">Nama Display<", ">{t('profilePage.displayName')}<"),
    (">Profesi Utama<", ">{t('profilePage.primaryProfession')}<"),
    (">Bio Singkat<", ">{t('profilePage.shortBio')}<"),
    (">No. WhatsApp<", ">{t('profilePage.whatsappNo')}<"),
    (">Slug URL (/p/", ">{t('profilePage.slugUrl')} (/p/"),
    (">URL Profil Publik kamu: ", ">{t('profilePage.publicProfileUrl')} "),
    (">Info Rekening Bank (Untuk Pencairan)<", ">{t('profilePage.bankInfo')}<"),
    (">Bank / e-Wallet<", ">{t('profilePage.bankOrEwallet')}<"),
    (">Pilih Bank<", ">{t('profilePage.selectBank')}<"),
    (">Nomor Rekening<", ">{t('profilePage.accountNumber')}<"),
    (">Nama Pemilik Rekening<", ">{t('profilePage.accountName')}<"),
    (">Branded Invoice<", ">{t('profilePage.brandedInvoice')}<"),
    (">Kustomisasi tampilan invoice kamu agar terlihat lebih profesional<", ">{t('profilePage.customizeInvoice')}<"),
    (">Logo Invoice<", ">{t('profilePage.invoiceLogo')}<"),
    ("? 'Uploading...' : 'Upload Logo'", "? t('profilePage.uploading') : t('profilePage.uploadLogo')"),
    (">Warna Aksen Invoice<", ">{t('profilePage.invoiceAccentColor')}<"),
    (">Simpan Perubahan<", ">{t('profilePage.saveChanges')}<"),
    (">Menyimpan...<", ">{t('profilePage.saving')}<"),
    ("Memuat profil...", "{t('profilePage.loading')}"),
    ("'Foto profil berhasil diupload'", "t('profilePage.avatarSuccess')"),
    ("'Gagal upload foto'", "t('profilePage.avatarFail')"),
    ("'Banner berhasil diupload'", "t('profilePage.bannerSuccess')"),
    ("'Gagal upload banner'", "t('profilePage.bannerFail')"),
    ("'Profil berhasil diperbarui'", "t('profilePage.profileOk')"),
    ("'Gagal menyimpan profil'", "t('profilePage.profileFail')"),
    ("'Terjadi kesalahan'", "t('profilePage.errorGeneric')")
]
replace_in_file(os.path.join(base, 'profile/page.js'), profile_replacements)

print("Refactoring complete.")
