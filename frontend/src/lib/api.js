const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (typeof window !== 'undefined') {
    const Cookies = (await import('js-cookie')).default;
    const token = Cookies.get('access_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && typeof window !== 'undefined') {
    const Cookies = (await import('js-cookie')).default;
    const refresh = Cookies.get('refresh_token');
    if (refresh) {
      const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        Cookies.set('access_token', data.access);
        headers['Authorization'] = `Bearer ${data.access}`;
        res = await fetch(url, { ...options, headers });
      } else {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }
  }

  return res;
}

// Auth
export async function login(email, password) {
  return fetchAPI('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function register(data) {
  return fetchAPI('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getProfile() {
  return fetchAPI('/auth/me/');
}

export async function updateProfile(data) {
  return fetchAPI('/auth/me/', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Services
export async function getServices() {
  return fetchAPI('/services/');
}

export async function createService(data) {
  return fetchAPI('/services/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateService(id, data) {
  return fetchAPI(`/services/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteService(id) {
  return fetchAPI(`/services/${id}/`, {
    method: 'DELETE'
  });
}

// Portfolio
export async function getPortfolio() {
  return fetchAPI('/portfolio/');
}

export async function addPortfolioItem(data) {
  return fetchAPI('/portfolio/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deletePortfolioItem(id) {
  return fetchAPI(`/portfolio/${id}/`, {
    method: 'DELETE'
  });
}

// Invoices
export async function getInvoices(params = '') {
  return fetchAPI(`/invoices/${params}`);
}

export async function createInvoice(data) {
  return fetchAPI('/invoices/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getInvoice(id) {
  return fetchAPI(`/invoices/${id}/`);
}

export async function updateInvoice(id, data) {
  return fetchAPI(`/invoices/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteInvoice(id) {
  return fetchAPI(`/invoices/${id}/`, {
    method: 'DELETE'
  });
}

export async function sendInvoice(id) {
  return fetchAPI(`/invoices/${id}/send/`, {
    method: 'POST'
  });
}

export async function cancelInvoice(id) {
  return fetchAPI(`/invoices/${id}/cancel/`, {
    method: 'POST'
  });
}

// Dashboard
export async function getDashboard() {
  return fetchAPI('/dashboard/');
}

// AI Pricing
export async function getAIPricing(data) {
  return fetchAPI('/ai/pricing/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Public Methods
export async function getPublicProfile(slug) {
  return fetchAPI(`/p/${slug}/`);
}

export async function getPaymentInvoice(slug) {
  return fetchAPI(`/pay/${slug}/`);
}

export async function createCheckout(slug) {
  return fetchAPI(`/pay/${slug}/checkout/`, {
    method: 'POST'
  });
}

// Image Upload (Cloudinary)
export async function uploadImage(file, folder = 'general') {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const url = `${API_URL}/upload/`;
  const headers = {};

  if (typeof window !== 'undefined') {
    const Cookies = (await import('js-cookie')).default;
    const token = Cookies.get('access_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  return res;
}

// Analytics
export async function recordProfileView(slug) {
  return fetch(`${API_URL}/analytics/profile-view/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  });
}

export async function recordServiceClick(serviceId) {
  return fetch(`${API_URL}/analytics/service-click/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: serviceId }),
  });
}

export async function getAnalyticsStats() {
  return fetchAPI('/analytics/stats/');
}

// Tax Report
export async function getTaxReport(year) {
  return fetchAPI(`/dashboard/tax-report/?year=${year}`);
}

// Contracts
export async function getContracts() {
  return fetchAPI('/contracts/');
}

export async function getContract(id) {
  return fetchAPI(`/contracts/${id}/`);
}

export async function generateContract(invoiceId) {
  return fetchAPI('/contracts/generate/', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
}

export async function deleteContract(id) {
  return fetchAPI(`/contracts/${id}/`, {
    method: 'DELETE',
  });
}

// Invoice Reminder
export async function sendReminder(invoiceId) {
  return fetchAPI(`/invoices/${invoiceId}/remind/`, {
    method: 'POST',
  });
}
