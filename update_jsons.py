import json
import os

locale_dir = '/home/yoockh/Documents/hackathon/frontend/src/lib/i18n/locales'
id_path = os.path.join(locale_dir, 'id.json')
en_path = os.path.join(locale_dir, 'en.json')

with open(id_path, 'r', encoding='utf-8') as f:
    id_data = json.load(f)
with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# ID additions
id_data['taxReportPage']['note'] = "Estimasi PPh Final 0.5% UMKM (PP 55/2022). Berlaku jika omzet bruto < Rp 500 juta/tahun."

en_data['taxReportPage']['note'] = "Estimated Final Tax 0.5% SME (PP 55/2022). Applies if gross revenue < IDR 500 million/year."

# CreateInvoice Page
id_data['createInvoicePage'] = {
    "title": "Buat Invoice Baru",
    "subtitle": "Isi detail tagihan untuk klien kamu",
    "clientInfo": "Info Klien",
    "clientName": "Nama Klien / Perusahaan *",
    "clientNamePh": "Misal: PT Karya Bangsa",
    "clientEmail": "Email Klien (Opsional)",
    "clientEmailPh": "client@mail.com",
    "clientPhone": "No. Telepon Klien (Opsional)",
    "clientPhonePh": "08123456789",
    "dueDate": "Batas Waktu Bayar (Opsional)",
    "currency": "Mata Uang",
    "currIDR": "Rupiah (IDR)",
    "currUSD": "US Dollar (USD)",
    "currSGD": "Singapore Dollar (SGD)",
    "currEUR": "Euro (EUR)",
    "currMYR": "Malaysian Ringgit (MYR)",
    "serviceItems": "Item Jasa",
    "serviceDesc": "Deskripsi Jasa",
    "serviceDescPh": "Desain Logo...",
    "qty": "Qty",
    "unitPrice": "Harga Satuan (Rp)",
    "aiSuggest": "AI Suggest",
    "addCol": "Tambah Kolom Item",
    "taxPercent": "Pajak / PPN (%)",
    "clientNote": "Catatan untuk Klien",
    "clientNotePh": "Terima kasih atas kerjasamanya...",
    "subtotal": "Subtotal:",
    "taxLabel": "Pajak",
    "totalPay": "Total Pembayaran:",
    "cancel": "Batalkan",
    "saveDraft": "Simpan sebagai Draft",
    "saving": "Menyimpan...",
    "livePreview": "Live Preview",
    "invoiceTag": "INVOICE",
    "date": "Tanggal:",
    "dueDatePreview": "Jatuh Tempo:",
    "from": "Dari:",
    "to": "Kepada:",
    "descHeader": "Deskripsi",
    "qtyHeader": "Qty",
    "priceHeader": "Harga",
    "totalHeader": "Total",
    "noteLabel": "Catatan:",
    "madeWith": "Dibuat dengan"
}

en_data['createInvoicePage'] = {
    "title": "Create New Invoice",
    "subtitle": "Fill billing details for your client",
    "clientInfo": "Client Info",
    "clientName": "Client / Company Name *",
    "clientNamePh": "e.g. Acme Corp",
    "clientEmail": "Client Email (Optional)",
    "clientEmailPh": "client@mail.com",
    "clientPhone": "Client Phone No. (Optional)",
    "clientPhonePh": "+628123456789",
    "dueDate": "Due Date (Optional)",
    "currency": "Currency",
    "currIDR": "Rupiah (IDR)",
    "currUSD": "US Dollar (USD)",
    "currSGD": "Singapore Dollar (SGD)",
    "currEUR": "Euro (EUR)",
    "currMYR": "Malaysian Ringgit (MYR)",
    "serviceItems": "Service Items",
    "serviceDesc": "Service Description",
    "serviceDescPh": "Logo Design...",
    "qty": "Qty",
    "unitPrice": "Unit Price (IDR)",
    "aiSuggest": "AI Suggest",
    "addCol": "Add Item Column",
    "taxPercent": "Tax / VAT (%)",
    "clientNote": "Notes for Client",
    "clientNotePh": "Thank you for the cooperation...",
    "subtotal": "Subtotal:",
    "taxLabel": "Tax",
    "totalPay": "Total Payment:",
    "cancel": "Cancel",
    "saveDraft": "Save as Draft",
    "saving": "Saving...",
    "livePreview": "Live Preview",
    "invoiceTag": "INVOICE",
    "date": "Date:",
    "dueDatePreview": "Due Date:",
    "from": "From:",
    "to": "To:",
    "descHeader": "Description",
    "qtyHeader": "Qty",
    "priceHeader": "Price",
    "totalHeader": "Total",
    "noteLabel": "Note:",
    "madeWith": "Made with"
}

# AI Pricing Modal
id_data['aiPricingModal'] = {
    "title": "AI Pricing Assistant",
    "descLabel": "Deskripsikan Jasa Kamu",
    "descPh": "Contoh: Desain logo dan identitas visual perusahaan makanan ringan. Termasuk 3 revisi dan manual grafis standar.",
    "targetMarket": "Target Market",
    "marketPersonal": "Personal",
    "marketSME": "UMKM",
    "marketStartup": "Startup",
    "marketMidCorp": "Korporat Menengah",
    "marketBigCorp": "Korporat Besar",
    "complexity": "Kompleksitas",
    "compVerySimple": "Sangat Sederhana",
    "compSimple": "Sederhana",
    "compMedium": "Menengah",
    "compComplex": "Kompleks",
    "compVeryComplex": "Sangat Kompleks",
    "checkFairPrice": "Cek Harga Wajar",
    "calculating": "Menghitung Harga...",
    "estMarketPrice": "Estimasi Harga Pasar:",
    "detFactors": "Faktor Penentu:",
    "useMinPrice": "Gunakan Harga Min",
    "useMaxPrice": "Gunakan Harga Max",
    "errEmpty": "Deskripsi jasa tidak boleh kosong",
    "errFail": "Gagal menghitung harga",
    "errConn": "Terjadi kesalahan sambungan jaringan."
}

en_data['aiPricingModal'] = {
    "title": "AI Pricing Assistant",
    "descLabel": "Describe Your Service",
    "descPh": "Example: Logo and visual identity design for a snack company. Includes 3 revisions and a standard graphics manual.",
    "targetMarket": "Target Market",
    "marketPersonal": "Personal",
    "marketSME": "SME",
    "marketStartup": "Startup",
    "marketMidCorp": "Mid-sized Corp",
    "marketBigCorp": "Large Corp/Multinational",
    "complexity": "Complexity",
    "compVerySimple": "Very Simple",
    "compSimple": "Simple",
    "compMedium": "Medium",
    "compComplex": "Complex",
    "compVeryComplex": "Very Complex",
    "checkFairPrice": "Check Fair Price",
    "calculating": "Calculating Price...",
    "estMarketPrice": "Estimated Market Price:",
    "detFactors": "Determining Factors:",
    "useMinPrice": "Use Min Price",
    "useMaxPrice": "Use Max Price",
    "errEmpty": "Service description cannot be empty",
    "errFail": "Failed to calculate price",
    "errConn": "A network connection error occurred."
}

with open(id_path, 'w', encoding='utf-8') as f:
    json.dump(id_data, f, ensure_ascii=False, indent=2)
with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("JSON files updated successfully.")
