'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en.json';
import id from './locales/id.json';

const DICTS = { en, id };
const DEFAULT_LOCALE = 'id';
const STORAGE_KEY = 'ui_language';

function getByPath(obj, path) {
    if (!obj) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
    }
    return cur;
}

function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

function normalizeLocale(locale) {
    return locale === 'en' ? 'en' : 'id';
}

function intlLocale(locale) {
    return locale === 'en' ? 'en-US' : 'id-ID';
}

const I18nContext = createContext({
    locale: DEFAULT_LOCALE,
    setLocale: () => { },
    t: (key) => key,
    tRaw: (key) => undefined,
    intlLocale: intlLocale(DEFAULT_LOCALE),
});

export function I18nProvider({ children }) {
    const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setLocaleState(normalizeLocale(saved));
        } catch { }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch { }
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const setLocale = useCallback((nextLocale) => {
        setLocaleState(normalizeLocale(nextLocale));
    }, []);

    const tRaw = useCallback((key) => {
        const fromActive = getByPath(DICTS[locale], key);
        if (fromActive !== undefined) return fromActive;
        const fromDefault = getByPath(DICTS[DEFAULT_LOCALE], key);
        return fromDefault;
    }, [locale]);

    const t = useCallback((key, vars) => {
        const val = tRaw(key);
        if (typeof val === 'string') return interpolate(val, vars);
        if (val == null) return key;
        return String(val);
    }, [tRaw]);

    const value = useMemo(() => ({
        locale,
        setLocale,
        t,
        tRaw,
        intlLocale: intlLocale(locale),
    }), [locale, setLocale, t, tRaw]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}

