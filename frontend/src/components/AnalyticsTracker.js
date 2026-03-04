'use client';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AnalyticsTracker({ slug, serviceIds = [] }) {
    useEffect(() => {
        // Track profile view
        if (slug) {
            fetch(`${API_URL}/analytics/profile-view/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            }).catch(() => { });
        }
    }, [slug]);

    const trackServiceClick = (serviceId) => {
        fetch(`${API_URL}/analytics/service-click/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service_id: serviceId }),
        }).catch(() => { });
    };

    return null; // This is a tracking-only component, no UI
}
