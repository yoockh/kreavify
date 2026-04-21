/**
 * Format angka ke format mata uang Rupiah Indonesia
 */
export function formatCurrency(amount, currency = 'IDR') {
  if (amount == null || isNaN(amount)) return 'Rp 0';
  if (currency === 'IDR') {
    return `Rp ${Number(amount).toLocaleString('id-ID')}`;
  }
  return Number(amount).toLocaleString('id-ID');
}

/**
 * Format persentase dengan tanda + jika positif
 */
export function formatPercentage(value) {
  if (value == null || isNaN(value)) return '0%';
  const num = parseFloat(value);
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
}

/**
 * Format angka besar ke singkatan (1.2jt, 500rb, dll)
 */
export function formatShortCurrency(amount) {
  if (amount == null || isNaN(amount)) return 'Rp 0';
  const num = Number(amount);
  if (num >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
  }
  if (num >= 1_000) {
    return `Rp ${(num / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${num}`;
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Ambil nama bulan dalam Bahasa Indonesia dari angka (1-12)
 */
export function getMonthName(monthNumber) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return months[(monthNumber - 1) % 12] || '';
}

/**
 * Format label bulan seperti "Jan 2025" dari string "2025-01"
 */
export function formatMonthLabel(monthStr) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `${getMonthName(parseInt(month))} ${year}`;
}

/**
 * Tentukan warna berdasarkan tren (naik/turun/stabil)
 */
export function getTrendColor(trend) {
  if (!trend) return '#6b7280';
  const lower = trend.toLowerCase();
  if (lower === 'naik' || lower === 'up') return '#10b981';
  if (lower === 'turun' || lower === 'down') return '#ef4444';
  return '#6b7280';
}

/**
 * Tentukan warna badge berdasarkan status analisis harga
 */
export function getPricingStatusColor(status) {
  if (!status) return '#6b7280';
  if (status === 'underprice') return '#ef4444';
  if (status === 'overprice') return '#f59e0b';
  if (status === 'fair') return '#10b981';
  return '#6b7280';
}

/**
 * Label status analisis harga dalam Bahasa Indonesia
 */
export function getPricingStatusLabel(status) {
  if (status === 'underprice') return 'Terlalu Murah';
  if (status === 'overprice') return 'Terlalu Mahal';
  if (status === 'fair') return 'Harga Sesuai';
  return status || '-';
}

/**
 * Label experience level dalam Bahasa Indonesia
 */
export function getExperienceLevelLabel(level) {
  if (level === 'junior') return 'Junior';
  if (level === 'mid') return 'Menengah';
  if (level === 'senior') return 'Senior';
  return level || '-';
}

/**
 * Clamp nilai ke range [min, max]
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
