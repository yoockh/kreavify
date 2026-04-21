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

# tax-report/page.js
tax_replacements = [
    ("<span>{data.note}</span>", "<span>{data.note?.includes('UMKM') ? t('taxReportPage.note') : data.note}</span>")
]
replace_in_file(os.path.join(base, 'tax-report/page.js'), tax_replacements, add_i18n=False)

# invoices/page.js
invoices_replacements = [
    ("> Buat Invoice Baru", "> {t('invoicesPage.newInvoice')}")
]
replace_in_file(os.path.join(base, 'invoices/page.js'), invoices_replacements, add_i18n=False)

# services/page.js
services_replacements = [
    ("> Tambah Jasa", "> {t('servicesPage.addService')}")
]
replace_in_file(os.path.join(base, 'services/page.js'), services_replacements, add_i18n=False)

# portfolio/page.js
portfolio_replacements = [
    ("> Tambah Karya", "> {t('portfolioPage.addWork')}")
]
replace_in_file(os.path.join(base, 'portfolio/page.js'), portfolio_replacements, add_i18n=False)

# invoices/new/page.js
create_invoice_replacements = [
    (">Buat Invoice Baru<", ">{t('createInvoicePage.title')}<"),
    (">Isi detail tagihan untuk klien kamu<", ">{t('createInvoicePage.subtitle')}<"),
    (">Info Klien<", ">{t('createInvoicePage.clientInfo')}<"),
    (">Nama Klien / Perusahaan *<", ">{t('createInvoicePage.clientName')}<"),
    ("placeholder=\"Misal: PT Karya Bangsa\"", "placeholder={t('createInvoicePage.clientNamePh')}"),
    (">Email Klien (Opsional)<", ">{t('createInvoicePage.clientEmail')}<"),
    ("placeholder=\"client@mail.com\"", "placeholder={t('createInvoicePage.clientEmailPh')}"),
    (">No. Telepon Klien (Opsional)<", ">{t('createInvoicePage.clientPhone')}<"),
    ("placeholder=\"08123456789\"", "placeholder={t('createInvoicePage.clientPhonePh')}"),
    (">Batas Waktu Bayar (Opsional)<", ">{t('createInvoicePage.dueDate')}<"),
    (">Mata Uang<", ">{t('createInvoicePage.currency')}<"),
    (">Rupiah (IDR)<", ">{t('createInvoicePage.currIDR')}<"),
    (">US Dollar (USD)<", ">{t('createInvoicePage.currUSD')}<"),
    (">Singapore Dollar (SGD)<", ">{t('createInvoicePage.currSGD')}<"),
    (">Euro (EUR)<", ">{t('createInvoicePage.currEUR')}<"),
    (">Malaysian Ringgit (MYR)<", ">{t('createInvoicePage.currMYR')}<"),
    (">Item Jasa<", ">{t('createInvoicePage.serviceItems')}<"),
    (">Deskripsi Jasa<", ">{t('createInvoicePage.serviceDesc')}<"),
    ("placeholder=\"Desain Logo...\"", "placeholder={t('createInvoicePage.serviceDescPh')}"),
    (">Qty<", ">{t('createInvoicePage.qty')}<"),
    (">Harga Satuan (Rp)<", ">{t('createInvoicePage.unitPrice')}<"),
    ("> AI Suggest", "> {t('createInvoicePage.aiSuggest')}"),
    ("> Tambah Kolom Item", "> {t('createInvoicePage.addCol')}"),
    (">Pajak / PPN (%)<", ">{t('createInvoicePage.taxPercent')}<"),
    (">Catatan untuk Klien<", ">{t('createInvoicePage.clientNote')}<"),
    ("placeholder=\"Terima kasih atas kerjasamanya...\"", "placeholder={t('createInvoicePage.clientNotePh')}"),
    (">Subtotal:<", ">{t('createInvoicePage.subtotal')}<"),
    ("Pajak (", "{t('createInvoicePage.taxLabel')} ("),
    (">Total Pembayaran:<", ">{t('createInvoicePage.totalPay')}<"),
    (">Batalkan<", ">{t('createInvoicePage.cancel')}<"),
    ("'Menyimpan...' : 'Simpan sebagai Draft'", "t('createInvoicePage.saving') : t('createInvoicePage.saveDraft')"),
    (">Live Preview<", ">{t('createInvoicePage.livePreview')}<"),
    (">INVOICE<", ">{t('createInvoicePage.invoiceTag')}<"),
    (">Tanggal:<", ">{t('createInvoicePage.date')}<"),
    (">Jatuh Tempo:<", ">{t('createInvoicePage.dueDatePreview')}<"),
    (">Dari:<", ">{t('createInvoicePage.from')}<"),
    (">Kepada:<", ">{t('createInvoicePage.to')}<"),
    (">Deskripsi<", ">{t('createInvoicePage.descHeader')}<"),
    (">Qty<", ">{t('createInvoicePage.qtyHeader')}<"),
    (">Harga<", ">{t('createInvoicePage.priceHeader')}<"),
    (">Total<", ">{t('createInvoicePage.totalHeader')}<"),
    (">Catatan:<", ">{t('createInvoicePage.noteLabel')}<"),
    ("Dibuat dengan ", "{t('createInvoicePage.madeWith')} ")
]
replace_in_file(os.path.join(base, 'invoices/new/page.js'), create_invoice_replacements, add_i18n=True)

# components/AIPricingModal.js
components_base = '/home/yoockh/Documents/hackathon/frontend/src/components'
ai_modal_replacements = [
    (">AI Pricing Assistant<", ">{t('aiPricingModal.title')}<"),
    (">Deskripsikan Jasa Kamu<", ">{t('aiPricingModal.descLabel')}<"),
    ("placeholder=\"Contoh: Desain logo dan identitas visual perusahaan makanan ringan. Termasuk 3 revisi dan manual grafis standar.\"", "placeholder={t('aiPricingModal.descPh')}"),
    (">Target Market<", ">{t('aiPricingModal.targetMarket')}<"),
    (">Personal<", ">{t('aiPricingModal.marketPersonal')}<"),
    (">UMKM<", ">{t('aiPricingModal.marketSME')}<"),
    (">Startup<", ">{t('aiPricingModal.marketStartup')}<"),
    (">Korporat Menengah<", ">{t('aiPricingModal.marketMidCorp')}<"),
    (">Korporat Besar<", ">{t('aiPricingModal.marketBigCorp')}<"),
    (">Kompleksitas<", ">{t('aiPricingModal.complexity')}<"),
    (">Sangat Sederhana<", ">{t('aiPricingModal.compVerySimple')}<"),
    (">Sederhana<", ">{t('aiPricingModal.compSimple')}<"),
    (">Menengah<", ">{t('aiPricingModal.compMedium')}<"),
    (">Kompleks<", ">{t('aiPricingModal.compComplex')}<"),
    (">Sangat Kompleks<", ">{t('aiPricingModal.compVeryComplex')}<"),
    ("'Menghitung Harga...' : 'Cek Harga Wajar'", "t('aiPricingModal.calculating') : t('aiPricingModal.checkFairPrice')"),
    (">Estimasi Harga Pasar:<", ">{t('aiPricingModal.estMarketPrice')}<"),
    (">Faktor Penentu:<", ">{t('aiPricingModal.detFactors')}<"),
    (">Gunakan Harga Min", ">{t('aiPricingModal.useMinPrice')}"),
    ("> Gunakan Harga Max", "> {t('aiPricingModal.useMaxPrice')}"),
    ("'Deskripsi jasa tidak boleh kosong'", "t('aiPricingModal.errEmpty')"),
    ("'Gagal menghitung harga'", "t('aiPricingModal.errFail')"),
    ("'Terjadi kesalahan sambungan jaringan.'", "t('aiPricingModal.errConn')")
]
replace_in_file(os.path.join(components_base, 'AIPricingModal.js'), ai_modal_replacements, add_i18n=True)

print("Applied translations to UI components successfully.")
