import { fetchAPI } from './api';

/**
 * Ambil prediksi pendapatan bulan depan dari model ML
 */
export async function getRevenueForecast() {
  const res = await fetchAPI('/ml/revenue-forecast/');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Dapatkan rekomendasi harga dari ML berdasarkan kategori & kompleksitas
 * @param {string} serviceCategory - kategori jasa (logo, branding, dll)
 * @param {string} complexity - tingkat kompleksitas: simple | medium | complex
 */
export async function getPricingRecommendation(serviceCategory, complexity = 'medium') {
  const res = await fetchAPI('/ml/pricing-recommendation/', {
    method: 'POST',
    body: JSON.stringify({ service_category: serviceCategory, complexity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Analisis apakah harga user sudah sesuai dengan pasar
 * @param {string} serviceCategory - kategori jasa
 * @param {number} userPrice - harga yang ditetapkan user
 */
export async function analyzePricing(serviceCategory, userPrice) {
  const res = await fetchAPI('/ml/pricing-analysis/', {
    method: 'POST',
    body: JSON.stringify({ service_category: serviceCategory, user_price: userPrice }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Dapatkan semua insights AI untuk dashboard (forecast + pricing analysis)
 */
export async function getDashboardInsights() {
  const res = await fetchAPI('/ml/dashboard-insights/');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}
