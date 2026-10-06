import type { BeanData } from './data/initialBeans';
import { INITIAL_BEANS } from './data/initialBeans';

const LOCAL_STORAGE_KEY = 'gierad_coffee_beans_v1';

function getApiUrl(subpath: string): string {
  if (typeof window !== 'undefined') {
    // If user is on naked domain gierad.com, use www.gierad.com to bypass any Apache 301 POST dropping
    if (window.location.hostname === 'gierad.com') {
      return `https://www.gierad.com/coffee/api${subpath}`;
    }
  }
  return `/coffee/api${subpath}`;
}

// In-memory or localStorage fallback helpers
function getStoredLocalBeans(): Record<string, BeanData> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load beans from localStorage', err);
  }
  return INITIAL_BEANS;
}

function saveStoredLocalBeans(data: Record<string, BeanData>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save beans to localStorage', err);
  }
}

export async function fetchBeans(): Promise<Record<string, BeanData>> {
  try {
    const res = await fetch(getApiUrl(`/beans?t=${Date.now()}`), {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        saveStoredLocalBeans(data);
        return data;
      }
    }
  } catch (e) {
    console.info('API unavailable, using cached/local beans database:', e);
  }
  return getStoredLocalBeans();
}

export async function saveAllBeansApi(data: Record<string, BeanData>): Promise<void> {
  saveStoredLocalBeans(data);
  try {
    const res = await fetch(getApiUrl('/beans'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.error('Failed to save all beans to server:', res.status, await res.text());
    }
  } catch (e) {
    console.warn('Could not persist to server API, saved to local storage:', e);
  }
}

export async function upsertBeanApi(name: string, bean: Partial<BeanData>): Promise<void> {
  // Update local copy immediately for instant UI responsiveness
  const current = getStoredLocalBeans();
  const existing = current[name] || {};
  const merged: BeanData = {
    ...existing,
    ...bean,
    ...(bean.espresso ? { espresso: { ...existing.espresso, ...bean.espresso } } : {}),
    ...(bean.pourover ? { pourover: { ...existing.pourover, ...bean.pourover } } : {}),
    ...(bean.oat ? { oat: { ...existing.oat, ...bean.oat } } : {})
  };
  current[name] = merged;
  saveStoredLocalBeans(current);

  try {
    const res = await fetch(getApiUrl(`/beans/${encodeURIComponent(name)}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bean)
    });
    if (!res.ok) {
      console.error('Server returned error on upsertBean:', res.status, await res.text());
    } else {
      const json = await res.json();
      if (json && json.bean) {
        current[name] = json.bean;
        saveStoredLocalBeans(current);
      }
    }
  } catch (e) {
    console.warn('Could not persist bean to server API, saved locally:', e);
  }
}

export async function deleteBeanApi(name: string): Promise<void> {
  const current = getStoredLocalBeans();
  delete current[name];
  saveStoredLocalBeans(current);

  try {
    const res = await fetch(getApiUrl(`/beans/${encodeURIComponent(name)}`), {
      method: 'DELETE'
    });
    if (!res.ok) {
      console.error('Server returned error on deleteBean:', res.status, await res.text());
    }
  } catch (e) {
    console.warn('Could not delete bean on server, updated locally:', e);
  }
}

export async function sendChatMessage(message: string, context: unknown): Promise<string> {
  try {
    const res = await fetch(getApiUrl('/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.response) {
        return data.response;
      }
    }
  } catch (e) {
    console.error('Chat endpoint error:', e);
  }

  // Graceful local intelligence response when offline or key not configured
  return "AI Assistant response unavailable: Server connection or GEMINI_API_KEY is not configured on Dreamhost yet. Check /coffee/api/config.php.";
}
